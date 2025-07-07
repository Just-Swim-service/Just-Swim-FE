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
    size = 20,
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
    ...uploadedImages.map((f) => {
      // 동영상 파일의 경우 썸네일을 사용, 이미지 파일의 경우 fileURL 사용
      return f.type === 'video' ? f.thumbnailPath || f.fileURL : f.fileURL;
    }),
  ].filter(Boolean);

  // 디버깅을 위한 로그
  console.log('FileInput Debug:', {
    initialDefaultImages,
    uploadedImages: uploadedImages.map((f) => ({
      name: f.name,
      type: f.type,
      fileURL: f.fileURL,
      thumbnailPath: f.thumbnailPath,
    })),
    previewImages,
  });

  const onChangeImages = async (event: ChangeEvent<HTMLInputElement>) => {
    if (onDelete.current) return;

    const { files } = event.target;
    if (!files) {
      alert('파일을 추가해주세요.');
      return;
    }

    const fileArray = Array.from(files);
    let newFiles: FileWithPreview[] = [];
    let hasInvalidFile = false;
    let processedCount = 0;

    for (const file of fileArray) {
      console.log('Processing file:', {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      // 파일 크기 체크
      if (file.size > size * 1024 * 1024) {
        console.log('File too large:', file.name);
        hasInvalidFile = true;
        processedCount++;
        continue;
      }

      // 파일 타입 체크
      if (!isImageFile(file) && (!allowVideo || !isVideoFile(file))) {
        hasInvalidFile = true;
        processedCount++;
        continue;
      }

      try {
        let fileURL: string;
        let fileType: 'image' | 'video' = 'image';
        let duration: number | undefined;
        let thumbnailPath: string | undefined;

        if (isImageFile(file)) {
          // 이미지 파일 처리
          fileURL = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
          });
        } else if (isVideoFile(file)) {
          // 동영상 파일 처리
          fileType = 'video';
          duration = await getVideoDuration(file);
          thumbnailPath = await generateVideoThumbnail(file);
          // 동영상 파일의 경우 원본 파일의 URL을 생성
          fileURL = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
          });
        } else {
          continue;
        }

        const fileWithURL = Object.assign(file, {
          fileURL,
          type: fileType,
          duration,
          thumbnailPath,
        });

        console.log('Created fileWithURL:', {
          name: fileWithURL.name,
          type: fileWithURL.type,
          fileURL: fileWithURL.fileURL?.substring(0, 50) + '...',
          thumbnailPath: fileWithURL.thumbnailPath?.substring(0, 50) + '...',
          duration: fileWithURL.duration,
        });

        const isDuplicate =
          initialDefaultImages.includes(fileWithURL.fileURL) ||
          uploadedImages.some((f) => f.fileURL === fileWithURL.fileURL);

        if (!isDuplicate) {
          newFiles.push(fileWithURL);
        }

        processedCount++;

        if (processedCount === fileArray.length) {
          if (hasInvalidFile) {
            const allowedTypes = allowVideo
              ? '이미지 또는 동영상 파일만 추가할 수 있으며'
              : '이미지 파일만 추가할 수 있으며';
            alert(
              `${allowedTypes}, ${size}MB 이하의 파일만 업로드할 수 있습니다.`,
            );
          }

          const total = [...uploadedImages, ...newFiles];
          const limited = total.slice(0, length);
          setUploadedImages(limited);

          const store = new DataTransfer();
          limited.forEach((file) => {
            // 원본 File 객체의 내용을 사용하여 새로운 File 객체 생성
            const originalFile = new File([file as Blob], file.name, {
              type: file.type || 'application/octet-stream',
              lastModified: file.lastModified,
            });
            store.items.add(originalFile);
          });
          if (inputRef.current) {
            inputRef.current.files = store.files;
          }
        }
      } catch (error) {
        console.error('파일 처리 중 오류:', error);
        hasInvalidFile = true;
        processedCount++;
      }
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
        // 원본 File 객체의 내용을 사용하여 새로운 File 객체 생성
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
    console.log('handleOnChange called:', event.target.files?.length, 'files');
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
