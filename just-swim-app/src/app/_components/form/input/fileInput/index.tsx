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
      console.error('❌ 파일이 선택되지 않았습니다.');
      alert('파일을 추가해주세요.');
      return;
    }

    console.log('📁 선택된 파일 개수:', files.length);
    const fileArray = Array.from(files);
    const validFiles: FileWithPreview[] = [];
    let invalidCount = 0;
    let invalidReasons: string[] = [];

    for (const file of fileArray) {
      console.log('🔍 파일 검증 시작:', {
        name: file.name,
        type: file.type,
        sizeMB: (file.size / 1024 / 1024).toFixed(2),
        sizeBytes: file.size,
      });

      const isImage = isImageFile(file);
      const isVideo = allowVideo && isVideoFile(file);

      console.log('📋 파일 타입 검증 결과:', {
        isImage,
        isVideo,
        allowVideo,
        fileType: file.type,
      });

      if (!isImage && !isVideo) {
        const reason = `허용되지 않은 파일 형식: ${file.name} (${file.type})`;
        console.warn('❌', reason);
        invalidReasons.push(reason);
        invalidCount++;
        continue;
      }

      if (file.size > size * 1024 * 1024) {
        const reason = `파일 용량 초과: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB > ${size}MB)`;
        console.warn('❌', reason);
        invalidReasons.push(reason);
        invalidCount++;
        continue;
      }

      // 파일 크기가 0인 경우 체크
      if (file.size === 0) {
        const reason = `빈 파일: ${file.name}`;
        console.warn('❌', reason);
        invalidReasons.push(reason);
        invalidCount++;
        continue;
      }

      try {
        console.log('✅ 파일 검증 통과, 처리 시작:', file.name);
        let fileURL = '';
        let fileType: 'image' | 'video' = isVideo ? 'video' : 'image';
        let duration: number | undefined;
        let thumbnailPath: string | undefined;

        if (isImage) {
          console.log('🖼️ 이미지 파일 처리 중:', file.name);
          fileURL = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              console.log('✅ 이미지 파일 읽기 완료:', file.name);
              resolve(reader.result as string);
            };
            reader.onerror = () => {
              console.error('❌ 이미지 파일 읽기 실패:', file.name);
              reject(new Error('이미지 파일 읽기 실패'));
            };
            reader.readAsDataURL(file);
          });
        } else if (isVideo) {
          console.log('🎥 비디오 파일 처리 중:', file.name);
          try {
            duration = await getVideoDuration(file);
            console.log('✅ 비디오 길이 추출 완료:', duration);
          } catch (durationError) {
            console.error('❌ 비디오 길이 추출 실패:', durationError);
            throw new Error('비디오 길이 추출 실패');
          }

          try {
            thumbnailPath = await generateVideoThumbnail(file);
            console.log('✅ 비디오 썸네일 생성 완료:', thumbnailPath);
          } catch (thumbnailError) {
            console.error('❌ 비디오 썸네일 생성 실패:', thumbnailError);
            throw new Error('비디오 썸네일 생성 실패');
          }

          fileURL = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              console.log('✅ 비디오 파일 읽기 완료:', file.name);
              resolve(reader.result as string);
            };
            reader.onerror = () => {
              console.error('❌ 비디오 파일 읽기 실패:', file.name);
              reject(new Error('비디오 파일 읽기 실패'));
            };
            reader.readAsDataURL(file);
          });
        }

        const fileWithURL: FileWithPreview = {
          ...file,
          fileURL,
          type: fileType,
          duration,
          thumbnailPath,
        };

        const isDuplicate =
          initialDefaultImages.includes(fileWithURL.fileURL) ||
          uploadedImages.some((f) => f.fileURL === fileWithURL.fileURL);

        if (isDuplicate) {
          console.log('⚠️ 중복된 파일:', file.name);
          continue;
        }

        console.log('✅ 파일 처리 완료:', {
          name: file.name,
          type: fileType,
          fileURL: fileWithURL.fileURL ? '생성됨' : '실패',
        });

        validFiles.push(fileWithURL);
      } catch (err) {
        const reason = `파일 처리 실패: ${file.name} - ${err instanceof Error ? err.message : '알 수 없는 오류'}`;
        console.error('❌', reason, err);
        invalidReasons.push(reason);
        invalidCount++;
      }
    }

    const total = [...uploadedImages, ...validFiles].slice(0, length);
    console.log('📊 최종 결과:', {
      validFilesCount: validFiles.length,
      invalidCount,
      totalCount: total.length,
      invalidReasons,
    });

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
        `업로드 실패:\n${invalidReasons.join('\n')}\n\n이미지 또는 동영상 파일만 업로드 가능하며, 크기는 ${size}MB 이하 이어야 합니다.`,
      );
    }
  };

  const deleteUploadedImage = async (index: number) => {
    onDelete.current = true;

    const deleteS3Image = async (fileURL: string) => {
      try {
        if (fileURL.startsWith('data:')) {
          console.log(
            '로컬 파일이므로 S3 삭제 생략:',
            fileURL.substring(0, 50) + '...',
          );
          return;
        }

        await deleteFeedbackImageFromS3(fileURL);
      } catch (error) {
        console.error('S3 이미지 삭제 실패:', error);
      }
    };

    try {
      if (index < initialDefaultImages.length) {
        // 기존 이미지 삭제
        const newDefaults = [...initialDefaultImages];
        const removed = newDefaults.splice(index, 1)[0];
        setInitialDefaultImages(newDefaults);
        await deleteS3Image(removed);
      } else {
        // 새로 업로드된 이미지 삭제
        const realIndex = index - initialDefaultImages.length;
        const newUploaded = [...uploadedImages];
        const removed = newUploaded.splice(realIndex, 1)[0];

        // 상태 즉시 업데이트
        setUploadedImages(newUploaded);
        setValue(name, newUploaded, { shouldValidate: true });

        // input files 업데이트
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
        }

        // S3에서 삭제 (필요한 경우에만)
        if (removed.fileURL) {
          await deleteS3Image(removed.fileURL);
        }
      }
    } catch (error) {
      console.error('이미지 삭제 중 오류:', error);
    } finally {
      onDelete.current = false;
    }
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
