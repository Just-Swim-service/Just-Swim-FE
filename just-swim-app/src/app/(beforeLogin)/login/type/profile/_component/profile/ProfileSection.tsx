import styles from '@/app/(beforeLogin)/Common.module.css';
import Image from 'next/image';
import Gallery from '/public/assets/gallery.svg';
import { symlink } from 'fs';

export default function ProfileSection() {
  return (
    <>
      {/* TODO: 이미지 넣기 */}
      <section>
        <div>
          <div className="profile_img">
            <div className="gallery_button_wrapper">
              <button
                // onClick={handleButtonClick}
                className="gallery_button">
                <Image
                  src={Gallery}
                  alt="gallery"
                  // onClick={() =>
                  //   inputFileRef.current && inputFileRef.current.click()
                  // } // 이미지 클릭 시 파일 입력 클릭
                />
              </button>
              <input
                type="file"
                // accept="image/*"
                // ref={inputFileRef}
                style={{ display: 'none' }}
                // onChange={handleImageSelect} // 파일 입력 변경 시 handleImageSelect 함수 호출
              />
            </div>
          </div>
        </div>
        {/* <input type="text" value={nickname} onChange={handleChange} /> */}
        <input type="text" className="nickname" />
      </section>
    </>
  );
}
