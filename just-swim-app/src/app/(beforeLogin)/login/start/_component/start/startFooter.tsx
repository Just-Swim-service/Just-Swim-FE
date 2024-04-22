import { ReadonlyURLSearchParams } from 'next/navigation';
import  './start.scss';

export default function StartFooter({ handleRoute }: { handleRoute: any }) {
  return (
    <>
      <footer>
        <div className="button_wrapper">
          <button className="select_button" onClick={handleRoute}>
            시작하기
          </button>
        </div>
      </footer>
    </>
  );
}
