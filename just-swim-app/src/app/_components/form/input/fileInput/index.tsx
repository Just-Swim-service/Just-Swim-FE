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

import { FileInputProps } from '@types';
import { mergeRefs, randomId } from '@utils';
import { ConfirmModal, ImageCarousel } from '@components';
import { IconCancelWhite } from '@assets';

import styled from './styles.module.scss';
import { useModal } from '@hooks';

function _FileInput(
  {
    name,
    length = 4,
    size = 20,
    id = 'fileInput',
    defaultImages = [], // 기존 이미지 URL 배열을 받음
    onChange = (event: ChangeEvent<HTMLInputElement>) => {},
    // @ts-ignore
    setValue,
    // @ts-ignore
    errors = [],
    ...props
  }: FileInputProps &
    InputHTMLAttributes<HTMLInputElement> & {
      onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
      defaultImages?: string[];
    },
  ref: ForwardedRef<HTMLInputElement>,
) {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>(defaultImages);
  const inputRef = useRef<HTMLInputElement>(null);
  const onDelete = useRef<boolean>(false);

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

    if (
      newFiles.length + uploadedImages.length + defaultImages.length >
      length
    ) {
      alert(`${length}개 이하의 파일만 업로드할 수 있습니다.`);
      newFiles = newFiles.slice(
        0,
        length - uploadedImages.length - defaultImages.length,
      );
    }

    const result = [...uploadedImages, ...newFiles];
    const store = new DataTransfer();
    result.forEach((file) => store.items.add(file));

    if (inputRef.current) {
      inputRef.current.files = store.files;
    }

    setUploadedImages(result);
  };

  const deleteUploadedImage = (index: number) => {
    onDelete.current = true;

    // 기존 이미지 삭제인지 새로운 업로드된 파일 삭제인지 확인
    if (index < defaultImages.length) {
      // 기존 이미지 삭제 (defaultImages에서 제거)
      const newDefaultImages = [...defaultImages];
      newDefaultImages.splice(index, 1);
      setPreviewImages([
        ...newDefaultImages,
        ...uploadedImages.map((file) => URL.createObjectURL(file)),
      ]);
    } else {
      // 새로 업로드한 파일 삭제
      const newFiles = [
        ...uploadedImages.slice(0, index - defaultImages.length),
        ...uploadedImages.slice(index - defaultImages.length + 1),
      ];
      setUploadedImages(newFiles);

      const store = new DataTransfer();
      newFiles.forEach((file) => store.items.add(file));

      if (inputRef.current) {
        inputRef.current.files = store.files;
        inputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    onDelete.current = false;
  };

  useEffect(() => {
    const newPreviewImages = [
      ...defaultImages,
      ...uploadedImages.map((file) => URL.createObjectURL(file)),
    ];
    setPreviewImages(newPreviewImages);
    setValue(name, uploadedImages);
  }, [uploadedImages, setValue, defaultImages]);

  // 캐러셀 관련
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { modal, setModal, showModal, hideModal } = useModal();

  useEffect(() => {
    if (selectedIndex >= previewImages.length && selectedIndex !== 0) {
      setSelectedIndex(previewImages.length - 1);
    }
    if (previewImages.length === 0) {
      setModal(false);
    }
  }, [previewImages]);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeImages(event);
    onChange(event);
  };

  return (
    <>
      <div className={styled.input_wrapper}>
        <div className={styled.preview_wrapper}>
          {previewImages.map((preview, index) => (
            <div
              key={randomId()}
              className={styled.preview_item}
              style={{ backgroundImage: `url(${preview})` }}
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
          {...props}
          name={name}
          id={id}
          ref={mergeRefs(inputRef, ref)}
          type="file"
          multiple
          hidden
          readOnly
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
    </>
  );
}

export const FileInput = forwardRef(_FileInput);
