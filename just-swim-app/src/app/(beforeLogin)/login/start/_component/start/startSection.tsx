import { ReadonlyURLSearchParams } from 'next/navigation';
import './start.scss';

export default function StartSection({
  param,
}: {
  param: ReadonlyURLSearchParams;
}) {
  return (
    <>
      {/* TODO: 이미지 넣기 */}
      <div className="section">
        <div>
          <div className="TypeButtonImg">
            <div>
              <h3>{param.get('type')}</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
