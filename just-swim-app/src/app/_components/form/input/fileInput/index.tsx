'use client';

import {
  ChangeEvent,
  ForwardedRef,
  InputHTMLAttributes,
  MouseEvent,
  forwardRef,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';

import { dataURLtoBlob, generateVideoThumbnail, mergeRefs } from '@utils';
import { ImageCarousel } from '@components';
import { IconCancelWhite } from '@assets';
import styled from './styles.module.scss';
import { useModal } from '@hooks';
import { FileInputProps, StoredFileMeta } from '@types';
import { isVideoFile, isImageFile } from '@utils';
import { deleteFeedbackImageFromS3, getFeedbackPresignedURL } from '@apis';
import { feedbackStore } from '@/_store/feedback';

function FileInputInner(
  {
    name,
    length = 4,
    size = 100,
    id = 'fileInput',
    defaultPreviewImages = [],
    setValue,
    accept = 'image/*,video/*',
    allowVideo = true,
    feedbackType,
    ...inputProps
  }: FileInputProps & InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [initialDefaultImages, setInitialDefaultImages] = useState<
    StoredFileMeta[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { modal, setModal, showModal, hideModal } = useModal();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { getFeedbackFormData, setFeedbackFormData } = feedbackStore();

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = () => resolve(0);
    });
  };

  useEffect(() => {
    const current = getFeedbackFormData();
    const restored = (current.files ?? []).filter((f: any) =>
      f.filePath?.startsWith('https://'),
    ) as StoredFileMeta[];
    setInitialDefaultImages(restored);
  }, []);

  useEffect(() => {
    const onlyFiles = uploadedFiles.map((f) => f.originalFile);
    if (onlyFiles.length > 0) {
      setValue(name, onlyFiles, { shouldValidate: true });
    }

    const current = getFeedbackFormData();
    const defaultFiles = initialDefaultImages.map((url) => ({
      filePath: url.filePath,
      fileType: url.fileType,
      fileName: url.fileName,
      fileSize: url.fileSize,
      duration: url.duration,
      thumbnailPath: url.thumbnailPath,
    }));

    const newFiles = uploadedFiles.map((f) => ({
      filePath: f.filePath,
      fileType: f.mediaType,
      fileName: f.originalFile.name,
      fileSize: f.originalFile.size,
      duration: f.duration ? f.duration.toFixed(1) : null,
      thumbnailPath: f.thumbnailPath ?? null,
    }));

    setFeedbackFormData(
      {
        ...current,
        files: [...defaultFiles, ...newFiles],
      },
      feedbackType,
    );
  }, [uploadedFiles, initialDefaultImages]);

  const previewURLs = useMemo(() => {
    const defaultThumbs = initialDefaultImages.map(
      (file) => file.thumbnailPath || file.filePath,
    );
    const uploadedThumbs = uploadedFiles.map(
      (file) => file.thumbnailPath || file.filePath,
    );
    return [...defaultThumbs, ...uploadedThumbs].filter(Boolean);
  }, [uploadedFiles, initialDefaultImages]);

  const onChangeImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files) return;

    const fileArray = Array.from(files);
    const invalidReasons: string[] = [];

    const processedFiles = await Promise.all(
      fileArray.map(async (file) => {
        if (!(file instanceof File)) return null;

        const isImage = isImageFile(file);
        const isVideo = allowVideo && isVideoFile(file);

        if (!isImage && !isVideo) {
          invalidReasons.push(`허용되지 않은 파일 형식: ${file.name}`);
          return null;
        }

        if (file.size === 0) {
          invalidReasons.push(`빈 파일: ${file.name}`);
          return null;
        }

        if (file.size > size * 1024 * 1024) {
          invalidReasons.push(`파일 용량 초과: ${file.name}`);
          return null;
        }

        const fileURL = isVideo
          ? URL.createObjectURL(file)
          : await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = () => reject('파일 읽기 실패');
              reader.readAsDataURL(file);
            });

        const duration = isVideo ? await getVideoDuration(file) : undefined;

        let thumbnailPath = null;
        if (isVideo) {
          const dataURL = await generateVideoThumbnail(file);
          if (dataURL) {
            const blob = dataURLtoBlob(dataURL);
            const safeFileName = `${file.name.replace(/\.[^/.]+$/, '')}-thumbnail.jpg`;

            try {
              const [presigned] = await getFeedbackPresignedURL([safeFileName]);
              const { presignedUrl } = presigned;

              const response = await fetch(presignedUrl, {
                method: 'PUT',
                body: blob,
                headers: { 'Content-Type': 'image/jpeg' },
              });

              if (response.ok) {
                thumbnailPath = presignedUrl.split('?')[0];
              }
            } catch (err) {
              console.error('[썸네일 업로드 실패]', err);
            }
          }
        }

        return {
          originalFile: file,
          fileURL,
          mediaType: isVideo ? 'video' : 'image',
          ...(duration ? { duration } : {}),
          ...(thumbnailPath ? { thumbnailPath } : {}),
        };
      }),
    );

    const validFiles = processedFiles.filter((f): f is any => !!f);
    const uniqueNewFiles = validFiles.filter(
      (newFile) =>
        !uploadedFiles.some(
          (existing) =>
            existing.originalFile.name === newFile.originalFile.name &&
            existing.originalFile.lastModified ===
              newFile.originalFile.lastModified,
        ),
    );

    const merged = [...uploadedFiles, ...uniqueNewFiles].slice(0, length);
    setUploadedFiles(merged);

    if (inputRef.current) {
      const store = new DataTransfer();
      merged.forEach((file) => store.items.add(file.originalFile));
      inputRef.current.files = store.files;
    }

    if (invalidReasons.length > 0) {
      alert(`업로드 실패:\n${invalidReasons.join('\n')}`);
    }
  };

  const deleteFile = async (index: number) => {
    const current = getFeedbackFormData();

    if (index < initialDefaultImages.length) {
      const updatedDefaults = [...initialDefaultImages];
      const removedMeta = updatedDefaults.splice(index, 1)[0];

      try {
        if (removedMeta?.filePath) {
          await deleteFeedbackImageFromS3(removedMeta.filePath);
        }
        if (
          removedMeta?.thumbnailPath &&
          removedMeta.thumbnailPath !== removedMeta.filePath
        ) {
          await deleteFeedbackImageFromS3(removedMeta.thumbnailPath);
        }
      } catch (err) {
        console.error('[S3 삭제 실패]', err);
      }

      setInitialDefaultImages(updatedDefaults);

      const updatedFiles = (current.files ?? []).filter(
        (file: any) => file.filePath !== removedMeta.filePath,
      );
      setFeedbackFormData({ ...current, files: updatedFiles }, feedbackType);
    } else {
      const realIndex = index - initialDefaultImages.length;
      const updated = [...uploadedFiles];
      const removed = updated.splice(realIndex, 1)[0];

      try {
        if (removed?.fileURL) {
          await deleteFeedbackImageFromS3(removed.fileURL);
        }
        if (
          removed?.thumbnailPath &&
          removed.thumbnailPath !== removed.fileURL
        ) {
          await deleteFeedbackImageFromS3(removed.thumbnailPath);
        }
      } catch (err) {
        console.error('[S3 삭제 실패]', err);
      }

      setUploadedFiles(updated);

      const updatedFiles = (current.files ?? []).filter(
        (file: any) => file.filePath !== removed?.fileURL,
      );
      setFeedbackFormData({ ...current, files: updatedFiles }, feedbackType);

      if (inputRef.current) {
        const store = new DataTransfer();
        updated.forEach((file) => store.items.add(file.originalFile));
        inputRef.current.files = store.files;
      }
    }
  };

  useEffect(() => {
    if (selectedIndex >= previewURLs.length) {
      setSelectedIndex(previewURLs.length > 0 ? previewURLs.length - 1 : 0);
    }
    if (previewURLs.length === 0) {
      setModal(false);
    }
  }, [previewURLs]);

  const { onChange: rhfOnChange, ...restInputProps } = inputProps;

  return (
    <div className={styled.input_wrapper}>
      <div className={styled.preview_wrapper}>
        {previewURLs.map((preview, index) => {
          if (!preview.trim()) return null;

          const resolvedIndex = index - initialDefaultImages.length;
          const file = uploadedFiles[resolvedIndex];
          const isVideo =
            file?.mediaType === 'video' || preview.startsWith('data:video');

          return (
            <div
              key={`${preview}-${index}`}
              className={styled.preview_item}
              onClick={(event: MouseEvent<HTMLDivElement>) => {
                event.preventDefault();
                setSelectedIndex(index);
                showModal();
              }}>
              {isVideo ? (
                <>
                  <video className={styled.preview_video} src={preview} />
                  <div className={styled.video_overlay}>
                    <div className={styled.play_icon}>▶</div>
                    {file?.duration !== undefined && !isNaN(file.duration) && (
                      <div className={styled.duration}>
                        {Math.floor(file.duration / 60)}:
                        {(Math.floor(file.duration) % 60)
                          .toString()
                          .padStart(2, '0')}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div
                  className={styled.preview_image}
                  style={{ backgroundImage: `url(${preview})` }}
                />
              )}
              <button
                className={styled.delete_button}
                onClick={(event: MouseEvent<HTMLButtonElement>) => {
                  event.stopPropagation();
                  event.preventDefault();
                  deleteFile(index);
                }}>
                <IconCancelWhite width={14} height={14} />
              </button>
            </div>
          );
        })}
      </div>

      <label htmlFor={id} className={styled.add_label}>
        <span>+</span>
      </label>

      <input
        {...restInputProps}
        name={name}
        id={id}
        ref={mergeRefs(inputRef, ref)}
        type="file"
        multiple
        accept={accept}
        hidden
        onChange={(e) => {
          onChangeImages(e);
          if (typeof rhfOnChange === 'function') rhfOnChange(e);
        }}
      />

      {modal && previewURLs.length > 0 && (
        <ImageCarousel
          images={previewURLs}
          index={selectedIndex}
          setIndex={setSelectedIndex}
          useDeleteButton={true}
          deleteImage={deleteFile}
          hideModal={hideModal}
        />
      )}
    </div>
  );
}

export const FileInput = forwardRef(FileInputInner);
