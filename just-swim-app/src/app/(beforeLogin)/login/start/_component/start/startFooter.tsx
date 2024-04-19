import { ReadonlyURLSearchParams } from 'next/navigation';
import  './start.scss';

export default function StartFooter({ handleRoute }: { handleRoute: any }) {
  return (
    <>
      <div className="footer">
        <div className="buttonWrapper">
          <button className="SelectButton" onClick={handleRoute}>
            시작하기
          </button>
        </div>
      </div>
    </>
  );
}
