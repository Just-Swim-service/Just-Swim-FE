import './selectType.scss';
import Link from 'next/link';

export default function SelectTypeFooter({ type }: { type: string }) {
  return (
    <>
      <div className="select_type_footer">
        <div className={`button_wrapper ${type ? 'active' : ''}`}>
          <Link
            href={{
              pathname: `/login/type/profile`,
              query: { type: `${type}` },
            }}>
            <button className="select_button">선택</button>
          </Link>
        </div>
      </div>
    </>
  );
}
