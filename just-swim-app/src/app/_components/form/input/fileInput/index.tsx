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

import { mergeRefs } from '@utils';
import { ImageCarousel } from '@components';
import { IconCancelWhite } from '@assets';
import styled from './styles.module.scss';
import { useModal } from '@hooks';
import { FileInputProps } from '@types';
import { isVideoFile, isImageFile } from '@utils';
import { deleteFeedbackImageFromS3 } from '@apis';
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
  const [initialDefaultImages, setInitialDefaultImages] = useState<string[]>([]);
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
      f.fileURL?.startsWith('https://'),
    );
    setInitialDefaultImages(restored.map((f: any) => f.fileURL));
  }, []);

  useEffect(() => {
    const onlyFiles = uploadedFiles.map((f) => f.originalFile);
    if (onlyFiles.length > 0) {
      setValue(name, onlyFiles, { shouldValidate: true });
    }

    const current = getFeedbackFormData();
    const defaultFiles = initialDefaultImages.map((url) => ({
      filePath: url,
      fileType: url.includes('video') ? 'video' : 'image',
      fileName: '',
      fileSize: 0,
      duration: null,
      thumbnailPath: null,
    }));

    const newFiles = uploadedFiles.map((f) => ({
      filePath: f.fileURL,
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
    return [
      ...initialDefaultImages,
      ...uploadedFiles.map((f) => f.fileURL),
    ].filter(Boolean);
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

        return {
          originalFile: file,
          fileURL,
          mediaType: isVideo ? 'video' : 'image',
          ...(duration ? { duration } : {}),
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
      const removedURL = updatedDefaults.splice(index, 1)[0];

      try {
        await deleteFeedbackImageFromS3(removedURL);
      } catch (err) {
        console.error('[S3 삭제 실패]', err);
      }

      setInitialDefaultImages(updatedDefaults);

      const updatedFiles = (current.files ?? []).filter(
        (file: any) => file.fileURL !== removedURL,
      );
      setFeedbackFormData({ ...current, files: updatedFiles }, feedbackType);
    } else {
      const realIndex = index - initialDefaultImages.length;
      const updated = [...uploadedFiles];
      const removed = updated.splice(realIndex, 1)[0];

      setUploadedFiles(updated);

      const updatedFiles = (current.files ?? []).filter(
        (file: any) => file.fileURL !== removed?.fileURL,
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
