import Image from 'next/image';
import styles from './Profile.module.css';
import Gallery from '/public/assets/gallery.svg';
import { symlink } from 'fs';

export default function ProfileSection({
  type,
  handleType,
}: {
  type: string;
  handleType: (type: string) => void;
}) {
  return (
    <>
      {/* TODO: 이미지 넣기 */}
      <div className={styles.section}>
        <div>
          <div className={styles.profileImg}>
            <div className={styles.galleryButtonWrapper}>
              <button
                // onClick={handleButtonClick}
                className={styles.galleryButton}>
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
        <div>
          {/* <input type="text" value={nickname} onChange={handleChange} /> */}
          <input type="text" className={styles.nickname}/>
        </div>
      </div>
    </>
  );
}
