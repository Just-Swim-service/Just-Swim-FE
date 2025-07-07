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
} from 'react';

import { mergeRefs } from '@utils';
import { ImageCarousel } from '@components';
import { IconCancelWhite } from '@assets';
import styled from './styles.module.scss';
import { useModal } from '@hooks';
import { FileInputProps, FileWithPreview } from '@types';
import { deleteFeedbackImageFromS3 } from '@apis';
import {
  generateVideoThumbnail,
  getVideoDuration,
  isVideoFile,
  isImageFile,
} from '@utils';

function FileInputInner(
  {
    name,
    length = 4,
    size = 100, // MB
    id = 'fileInput',
    defaultPreviewImages = [],
    onChange = () => {},
    setValue,
    accept = 'image/*,video/*',
    allowVideo = true,
    ...inputProps
  }: FileInputProps & InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const [uploadedImages, setUploadedImages] = useState<FileWithPreview[]>([]);
  const [initialDefaultImages, setInitialDefaultImages] = useState<string[]>([]);

  const isInitialRender = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const onDelete = useRef<boolean>(false);

  const { modal, setModal, showModal, hideModal } = useModal();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    if (isInitialRender.current && defaultPreviewImages.length > 0) {
      setInitialDefaultImages(defaultPreviewImages);
      isInitialRender.current = false;
    }
  }, [defaultPreviewImages]);

  useEffect(() => {
    setValue(name, uploadedImages, { shouldValidate: true });
  }, [uploadedImages]);

  const previewImages = [
    ...initialDefaultImages,
    ...uploadedImages.map((f) =>
      f.type === 'video' ? f.thumbnailPath || f.fileURL : f.fileURL,
    ),
  ].filter(Boolean);

  const onChangeImages = async (event: ChangeEvent<HTMLInputElement>) => {
    if (onDelete.current) return;

    const { files } = event.target;
    if (!files) {
      alert('파일을 추가해주세요.');
      return;
    }

    const fileArray = Array.from(files);
    const validFiles: FileWithPreview[] = [];
    let invalidCount = 0;

    for (const file of fileArray) {
      console.log('🔍 업로드 시도 중인 파일:', {
        name: file.name,
        type: file.type,
        sizeMB: (file.size / 1024 / 1024).toFixed(2),
      });

      const isImage = isImageFile(file);
      const isVideo = allowVideo && isVideoFile(file);

      if (!isImage && !isVideo) {
        console.warn('❌ 허용되지 않은 파일 형식:', file.name);
        invalidCount++;
        continue;
      }

      if (file.size > size * 1024 * 1024) {
        console.warn('❌ 파일 용량 초과:', file.name);
        invalidCount++;
        continue;
      }

      try {
        let fileURL = '';
        let fileType: 'image' | 'video' = isVideo ? 'video' : 'image';
        let duration: number | undefined;
        let thumbnailPath: string | undefined;

        if (isImage) {
          fileURL = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        } else if (isVideo) {
          duration = await getVideoDuration(file);
          thumbnailPath = await generateVideoThumbnail(file);
          fileURL = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        }

        const fileWithURL = Object.assign(file, {
          fileURL,
          type: fileType,
          duration,
          thumbnailPath,
        });

        const isDuplicate =
          initialDefaultImages.includes(fileWithURL.fileURL) ||
          uploadedImages.some((f) => f.fileURL === fileWithURL.fileURL);

        if (isDuplicate) {
          console.log('⚠️ 중복된 파일:', file.name);
          continue;
        }

        validFiles.push(fileWithURL);
      } catch (err) {
        console.error('❌ 파일 처리 실패:', file.name, err);
        invalidCount++;
      }
    }

    const total = [...uploadedImages, ...validFiles].slice(0, length);
    setUploadedImages(total);

    const store = new DataTransfer();
    total.forEach((file) => {
      const originalFile = new File([file as Blob], file.name, {
        type: file.type || 'application/octet-stream',
        lastModified: file.lastModified,
      });
      store.items.add(originalFile);
    });
    if (inputRef.current) {
      inputRef.current.files = store.files;
    }

    if (invalidCount > 0) {
      alert(
        `이미지 또는 동영상 파일만 업로드 가능하며, 크기는 ${size}MB 이하이어야 합니다.`,
      );
    }
  };

  const deleteUploadedImage = async (index: number) => {
    onDelete.current = true;

    const deleteS3Image = async (fileURL: string) => {
      try {
        await deleteFeedbackImageFromS3(fileURL);
      } catch (error) {
        console.error('S3 이미지 삭제 실패:', error);
      }
    };

    if (index < initialDefaultImages.length) {
      const newDefaults = [...initialDefaultImages];
      const removed = newDefaults.splice(index, 1)[0];
      setInitialDefaultImages(newDefaults);
      await deleteS3Image(removed);
    } else {
      const realIndex = index - initialDefaultImages.length;
      const newUploaded = [...uploadedImages];
      newUploaded.splice(realIndex, 1);
      setUploadedImages(newUploaded);
      setValue(name, newUploaded, { shouldValidate: true });

      const store = new DataTransfer();
      newUploaded.forEach((file) => {
        const originalFile = new File([file as Blob], file.name, {
          type: file.type || 'application/octet-stream',
          lastModified: file.lastModified,
        });
        store.items.add(originalFile);
      });
      if (inputRef.current) {
        inputRef.current.files = store.files;
        inputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    onDelete.current = false;
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeImages(event);
    onChange(event);
  };

  useEffect(() => {
    if (selectedIndex >= previewImages.length && selectedIndex !== 0) {
      setSelectedIndex(previewImages.length - 1);
    }
    if (previewImages.length === 0) {
      setModal(false);
    }
  }, [previewImages]);

  return (
    <div className={styled.input_wrapper}>
      <div className={styled.preview_wrapper}>
        {previewImages.map((preview, index) => {
          const file = uploadedImages[index - initialDefaultImages.length];
          const isVideo = file?.type === 'video';

          return (
            <div
              key={`${preview}-${index}`}
              className={styled.preview_item}
              style={{
                backgroundImage: preview ? `url("${preview}")` : 'none',
              }}
              onClick={(event: MouseEvent<HTMLDivElement>) => {
                event.preventDefault();
                setSelectedIndex(index);
                showModal();
              }}>
              {isVideo && (
                <div className={styled.video_overlay}>
                  <div className={styled.play_icon}>▶</div>
                  {file?.duration && (
                    <div className={styled.duration}>
                      {Math.floor(file.duration / 60)}:
                      {(file.duration % 60).toFixed(0).padStart(2, '0')}
                    </div>
                  )}
                </div>
              )}
              <button
                className={styled.delete_button}
                onClick={(event: MouseEvent<HTMLButtonElement>) => {
                  event.stopPropagation();
                  event.preventDefault();
                  deleteUploadedImage(index);
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
        {...inputProps}
        name={name}
        id={id}
        ref={mergeRefs(inputRef, ref)}
        type="file"
        multiple
        accept={accept}
        hidden
        onChange={handleOnChange}
        onClick={() => console.log('File input clicked')}
      />
      {modal && (
        <ImageCarousel
          images={previewImages}
          index={selectedIndex}
          setIndex={setSelectedIndex}
          useDeleteButton={true}
          deleteImage={deleteUploadedImage}
          hideModal={hideModal}
        />
      )}
    </div>
  );
}

export const FileInput = forwardRef(FileInputInner);
