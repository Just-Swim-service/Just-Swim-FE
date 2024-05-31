import "./profileSetting.scss";
import Link from 'next/link';

export default function ProfileSettingFooter({ type }: { type: string | undefined }) {
  return (
    <>
      <div className="profile_setting_footer">
        <div className="button_wrapper">
          <Link
            href={{
              pathname: `/login/start`,
              query: { type: type },
            }}>
            <button className="select_button active">
              다음
            </button>
          </Link>
        </div>
        <div className="button_wrapper">
          <Link
            href={{
              pathname: `/login/start`,
              query: { type: type },
            }}>
            <button className="select_button inactive">
              건너뛰기
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
