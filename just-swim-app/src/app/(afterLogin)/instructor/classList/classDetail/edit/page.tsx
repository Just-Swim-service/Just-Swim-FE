import Header from '../../../../../_component/Header';
import Input from '../../../../../_component/Input';
import ClassInfo from '../../../../_component/ClassInfo';
import './classInfoEdit.scss';

export default function ClassInfoEdit() {
  return (
    <div>
      <Header title="수업 정보 수정" />

      <div className="edit">
        <div className="inner">
          <h3>
            수정된 정보는 수강생 분들에게도 <br /> 적용되니 유의해주세요.
          </h3>

          <div className="class_info1">
            <Input label="수업명" defaultValue="아침 5반" type="text" />
            <Input
              label="수업 설명"
              defaultValue="초보 반으로, 배영 위주로 수업"
              type="text"
            />
            {/* <div className="input_text">수업명</div> */}
            {/* <input type="text" defaultValue={'아침 5반'} /> */}
          </div>
        </div>
        <div className="line"></div>
        <div className="inner">
          <ClassInfo islabel={true} bgColor={'gray'} />
        </div>
        <button className="edit_btn">수정하기</button>
      </div>
    </div>
  );
}
