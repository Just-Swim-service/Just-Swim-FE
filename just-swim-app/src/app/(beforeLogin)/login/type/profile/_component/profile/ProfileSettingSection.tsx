import styles from './profileSetting.module.scss';
import Image from 'next/image';
import Gallery from '/public/assets/gallery.svg';
import { symlink } from 'fs';

export default function ProfileSettingSection() {
  return (
    <>
      {/* TODO: 이미지 넣기 */}
      <section className={styles.profile_setting_section}>
        <div>
          <div className={styles.profile_img}>
            <div className={styles.gallery_button_wrapper}>
              <button
                // onClick={handleButtonClick}
                className={styles.gallery_button}>
                <Gallery />
                {/* <Image
                  src={Gallery}
                  alt="gallery"
                  // onClick={() =>
                  //   inputFileRef.current && inputFileRef.current.click()
                  // } // 이미지 클릭 시 파일 입력 클릭
                /> */}
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
        <input type="text" className={styles.nickname} />
      </section>
    </>
  );
}
