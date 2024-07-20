'use client';

import { ChangeEvent, ForwardedRef, InputHTMLAttributes, MouseEvent, forwardRef, useEffect, useRef, useState } from 'react';

import { FileInputProps } from '@types';
import { mergeRefs, randomId } from '@utils';
import { ConfirmModal, ImageCarousel } from '@components';
import { IconCancelWhite } from '@assets';

import styled from './styles.module.scss';
import { useModal } from '@hooks';

function _FileInput({
  name,
  length = 4,
  size = 20,
  id = 'fileInput',
  onChange = (event: ChangeEvent<HTMLInputElement>) => {},
  setValue,
  errors=[],
  ...props
}: FileInputProps & InputHTMLAttributes<HTMLInputElement> & {
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
},
ref: ForwardedRef<HTMLInputElement>) {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const onDelete = useRef<boolean>(false);

  const onChangeImages = (event: ChangeEvent<HTMLInputElement>) => {
    if (onDelete.current) {
      return;
    }

    const { target: { files } } = event;
  
    if (!files) {
      alert("파일을 추가해주세요.");
  
      return;
    }
    
    const step1 = [];
    let step2 = [];
    let flag = false;
  
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image")) {
        flag = true;
  
        continue;
      }
  
      step1.push(file);
    }
  
    if (flag) {
      alert("이미지 파일만 추가할 수 있습니다.");
      
      flag = false;
    }
  
    for (const file of step1) {
      // if (file.size > size * 1000000) {
        if (file.size > size * 1024 * 1024 ) {
        flag = true;
  
        continue;
      }
  
      step2.push(file);
    }
  
    if (flag) {
      alert(`${size}MB 이하의 파일만 업로드할 수 있습니다.`);
      
      flag = false;
    }

    if (step2.length + uploadedImages.length > length) {
      alert(`${length}개 이하의 파일만 업로드할 수 있습니다.`);

      step2 = step2.slice(0, length - uploadedImages.length);
    }

    const result = [...uploadedImages, ...step2];
    const store = new DataTransfer();

    result.forEach(file => store.items.add(file));

    if (inputRef.current) {
      inputRef.current.files = store.files;
    }

    setUploadedImages(result);
  }

  const deleteUploadedImage = (index: number) => {
    onDelete.current = true;
    
    const newFiles = [...uploadedImages.slice(0, index), ...uploadedImages.slice(index + 1)];

    const store = new DataTransfer();

    newFiles.forEach(file => store.items.add(file));

    if (inputRef.current) {
      inputRef.current.files = store.files;
      inputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    }

    onDelete.current = false;
    setUploadedImages(newFiles);
  }
  
  useEffect(() => {
    const result = [];

    for (const image of uploadedImages) {
      result.push(URL.createObjectURL(image));
    }

    setPreviewImages([...result]);
    ConfirmModal
    
    setValue(name, uploadedImages)
  }, [uploadedImages, setValue]);

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
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewImages]);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeImages(event);
    onChange(event);
  }

  return (
    <>
      <div className={styled.input_wrapper}>
        <div className={styled.preview_wrapper}>
          {
            previewImages.map((preview, index) => {
              return (
                <div key={randomId()} className={styled.preview_item} style={{
                  backgroundImage: `url(${preview})`,
                }} onClick={(event: MouseEvent<HTMLDivElement>) => {
                  event.preventDefault();
  
                  setSelectedIndex(index);
                  showModal();
                }}>
                  <button className={styled.delete_button} onClick={(event: MouseEvent<HTMLButtonElement>) => {
                    event.stopPropagation();
                    event.preventDefault();
                    
                    deleteUploadedImage(index);
                  }}>
                    <IconCancelWhite width={14} height={14} />
                  </button>
                </div>
              )
            })
          }
        </div>
        <label htmlFor={id} className={styled.add_label}>
          <span>+</span>
        </label>
     
        <input
          {...props}
          name={name}
          id={id}
          ref={mergeRefs(inputRef, ref)}
          type='file'
          multiple
          hidden
          readOnly
          onChange={handleOnChange}
        />
        {/* <span className={styled.error}>
          {errors.map((error,index) => <li key={index}>{error}</li>) }
        </span> */}
        {
          modal &&
          <ImageCarousel
            images={previewImages}
            index={selectedIndex}
            setIndex={setSelectedIndex}
            useDeleteButton={true}
            deleteImage={deleteUploadedImage}
            hideModal={hideModal}
          />
        }
          
      </div>
    </>
  );
}

/**
 * 상위 컴포넌트에서 FileInput 대한 className을 직접 설정하지 않도록 주의! (동작하지 않음)
 * @param {string} name input의 name
 * @param {number} length 입력받는 파일의 개수
 * @param {number} size 입력받는 파일의 크기
 * @param {import('react').MutableRefObject<HTMLInputElement>} ref input의 ref attribute에 연결할 target
 * @param {import('react').InputHTMLAttributes<HTMLInputElement>} attributes input에서 사용 가능한 모든 attributes
 */
export const FileInput = forwardRef(_FileInput);