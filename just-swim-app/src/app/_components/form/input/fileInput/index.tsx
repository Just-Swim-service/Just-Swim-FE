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
import { mergeRefs, randomId } from '@utils';
import { ImageCarousel } from '@components';
import { IconCancelWhite } from '@assets';
import styled from './styles.module.scss';
import { useModal } from '@hooks';
import { FormType } from '@/_schema';
import { FileInputProps } from '@types';

function FileInputInner(
  {
    name,
    length = 4,
    size = 20,
    id = 'fileInput',
    defaultFiles = [],
    defaultPreviewImages = [],
    onChange = (event: ChangeEvent<HTMLInputElement>) => {},
    setValue,
    ...inputProps
  }: FileInputProps & InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>,
) {
  console.log(defaultFiles);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [initialDefaultImages, setInitialDefaultImages] = useState<string[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  console.log(initialDefaultImages);

  const inputRef = useRef<HTMLInputElement>(null);
  const onDelete = useRef<boolean>(false);

  const { modal, setModal, showModal, hideModal } = useModal();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    if (defaultPreviewImages && defaultPreviewImages.length > 0) {
      setInitialDefaultImages(defaultPreviewImages);
    }
  }, [defaultPreviewImages]);

  useEffect(() => {
    if (defaultFiles && defaultFiles.length > 0) {
      const filePreviews = defaultFiles
        .filter((f): f is File => f instanceof File)
        .map((file) => URL.createObjectURL(file));

      setPreviewImages((prev) => [...prev, ...filePreviews]);

      return () => {
        filePreviews.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [defaultFiles]);

  const onChangeImages = (event: ChangeEvent<HTMLInputElement>) => {
    if (onDelete.current) return;

    const { files } = event.target;
    if (!files) {
      alert('파일을 추가해주세요.');
      return;
    }

    let newFiles: File[] = [];
    let hasInvalidFile = false;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image')) {
        hasInvalidFile = true;
        continue;
      }
      if (file.size > size * 1024 * 1024) {
        hasInvalidFile = true;
        continue;
      }
      newFiles.push(file);
    }

    if (hasInvalidFile) {
      alert(
        `이미지 파일만 추가할 수 있으며, ${size}MB 이하의 파일만 업로드할 수 있습니다.`,
      );
    }

    if (newFiles.length + uploadedImages.length > length) {
      alert(`${length}개 이하의 파일만 업로드할 수 있습니다.`);
      newFiles = newFiles.slice(0, length - uploadedImages.length);
    }

    const result = [...uploadedImages, ...newFiles];
    setUploadedImages(result);

    const store = new DataTransfer();
    result.forEach((file) => store.items.add(file));
    if (inputRef.current) {
      inputRef.current.files = store.files;
    }
  };

  const deleteUploadedImage = (index: number) => {
    onDelete.current = true;

    const totalImages = [...initialDefaultImages, ...uploadedImages];
    if (index < initialDefaultImages.length) {
      const newDefaults = [...initialDefaultImages];
      newDefaults.splice(index, 1);
      setInitialDefaultImages(newDefaults);
    } else {
      const fileIndex = index - initialDefaultImages.length;
      const newUploaded = [...uploadedImages];
      newUploaded.splice(fileIndex, 1);
      setUploadedImages(newUploaded);

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
