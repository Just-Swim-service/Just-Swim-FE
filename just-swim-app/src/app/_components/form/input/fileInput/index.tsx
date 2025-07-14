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

const FileInputInner = (
  {
    name,
    length = 4,
    size = 100,
    id = 'fileInput',
    defaultPreviewImages = [],
    setValue,
    accept = 'image/*,video/*',
    allowVideo = true,
    ...inputProps
  }: FileInputProps & InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [initialDefaultImages, setInitialDefaultImages] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { getFeedbackFormData, setFeedbackFormData } = feedbackStore();
  const { modal, setModal, showModal, hideModal } = useModal();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const getVideoDuration = (src: string): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = src;
      video.onloadedmetadata = () => resolve(video.duration);
      video.onerror = () => resolve(0);
    });
  };

  // ⚙️ 페이지 진입 시 기존 formDataState 복원 처리
  useEffect(() => {
    const formData = getFeedbackFormData();
    const currentFiles = formData?.files || [];

    const defaults = currentFiles
      .filter((f: any) => f.name === '' && f.fileURL?.startsWith('https'))
      .map((f: any) => f.fileURL);

    const restored = currentFiles
      .filter((f: any) => f.name && f.fileURL?.startsWith('data'))
      .map((f: any) => ({
        originalFile: new File([], f.name),
        fileURL: f.fileURL,
        mediaType: f.mediaType,
        duration: f.duration,
      }));

    setInitialDefaultImages(defaults);
    setUploadedFiles(restored);
  }, []);

  useEffect(() => {
    const onlyFiles = uploadedFiles.map((f) => f.originalFile);
    setValue(name, onlyFiles, { shouldValidate: true });

    const formData = getFeedbackFormData();
    const defaultFiles = initialDefaultImages.map((url) => ({
      name: '',
      size: 0,
      type: '',
      fileURL: url,
      mediaType: url.includes('video') ? 'video' : 'image',
    }));

    const newFiles = uploadedFiles.map((f) => ({
      name: f.originalFile.name,
      size: f.originalFile.size,
      type: f.originalFile.type,
      fileURL: f.fileURL,
      mediaType: f.mediaType,
      ...(f.duration ? { duration: f.duration } : {}),
    }));

    setFeedbackFormData(
      { ...formData, files: [...defaultFiles, ...newFiles] },
      'personal',
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

        if (!isImage && !isVideo) return null;
        if (file.size === 0 || file.size > size * 1024 * 1024) return null;

        const fileURL = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject('파일 읽기 실패');
          reader.readAsDataURL(file);
        });

        const duration = isVideo ? await getVideoDuration(fileURL) : undefined;

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
  };

  const deleteFile = async (index: number) => {
    const current = getFeedbackFormData();

    if (index < initialDefaultImages.length) {
      const removedURL = initialDefaultImages[index];

      try {
        await deleteFeedbackImageFromS3(removedURL);

        setInitialDefaultImages((prev) => prev.filter((url, i) => i !== index));
      } catch (err) {
        console.error('[S3 삭제 실패]', err);
      }
    } else {
      const realIndex = index - initialDefaultImages.length;
      const updated = [...uploadedFiles];
      updated.splice(realIndex, 1);
      setUploadedFiles(updated);

      if (inputRef.current) {
        const store = new DataTransfer();
        updated.forEach((file) => store.items.add(file.originalFile));
        inputRef.current.files = store.files;
      }
    }

    const updatedFiles = (current.files ?? []).filter(
      (file: any) => file.fileURL !== previewURLs[index],
    );
    setFeedbackFormData({ ...current, files: updatedFiles }, 'personal');
  };

  const { onChange: rhfOnChange, ...restInputProps } = inputProps;

  return (
    <div className={styled.input_wrapper}>
      <div className={styled.preview_wrapper}>
        {previewURLs.map((preview, index) => {
          const resolvedIndex = index - initialDefaultImages.length;
          const file = uploadedFiles[resolvedIndex];
          const isVideo =
            file?.mediaType === 'video' || preview.startsWith('data:video');

          return (
            <div
              key={`${preview}-${index}`}
              className={styled.preview_item}
              onClick={(e) => {
                e.preventDefault();
                setSelectedIndex(index);
                showModal();
              }}>
              {isVideo ? (
                <video className={styled.preview_video} src={preview} />
              ) : (
                <div
                  className={styled.preview_image}
                  style={{ backgroundImage: `url(${preview})` }}
                />
              )}
              <button
                className={styled.delete_button}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
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
};

export const FileInput = forwardRef(FileInputInner);
