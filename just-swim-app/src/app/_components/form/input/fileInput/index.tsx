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

import { UseFormSetValue } from 'react-hook-form';
import { mergeRefs } from '@utils';
import { ImageCarousel } from '@components';
import { IconCancelWhite } from '@assets';
import styled from './styles.module.scss';
import { useModal } from '@hooks';
import { FileInputProps, FileWithPreview } from '@types';
import { deleteFeedbackImageFromS3 } from '@apis';

function FileInputInner(
  {
    name,
    length = 4,
    size = 20,
    id = 'fileInput',
    defaultPreviewImages = [],
    onChange = () => {},
    setValue,
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
    ...uploadedImages.map((f) => f.fileURL),
  ].filter(Boolean);

  const onChangeImages = (event: ChangeEvent<HTMLInputElement>) => {
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

    fileArray.forEach((file) => {
      if (!file.type.startsWith('image') || file.size > size * 1024 * 1024) {
        hasInvalidFile = true;
        processedCount++;
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== 'string') return;

        const fileWithURL = Object.assign(file, {
          fileURL: reader.result,
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
            alert(
              `이미지 파일만 추가할 수 있으며, ${size}MB 이하의 파일만 업로드할 수 있습니다.`,
            );
          }

          const total = [...uploadedImages, ...newFiles];
          const limited = total.slice(0, length);
          setUploadedImages(limited);

          const store = new DataTransfer();
          limited.forEach((file) => store.items.add(file));
          if (inputRef.current) {
            inputRef.current.files = store.files;
          }
        }
      };

      reader.readAsDataURL(file);
    });
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
      newUploaded.forEach((file) => store.items.add(file));
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
        {previewImages.map((preview, index) => (
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
        ))}
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
