import './colorModal.scss';
import ColorPicker from './_component/ColorPicker';

export default function ColorModal(props) {
  const { showModal, setShowModal } = props;

  return (
    <div className="color_modal">
      <div className="modal_background">
        <div className="modal">
          <button className="modal_top_btn" onClick={() => setShowModal(false)}>
            <div></div>
          </button>
          <div className="modal_title">
            <div className="">구분 색</div>
            <div className="">스케쥴 정보 구분에 사용됩니다.</div>
          </div>
          <div className="color_list">
            <ColorPicker />
            {/* <ColorPicker color="red" />
            <ColorPicker color="yellow" />
            <ColorPicker color="green" />
            <ColorPicker color="blue" />
            <ColorPicker color="purple" />
            <ColorPicker color="pink" />
            <ColorPicker color="gray" /> */}
          </div>
          <div className="modal_btn">
            <button className="cancel" onClick={() => setShowModal(false)}>
              취소
            </button>
            <button className="save" onClick={() => setShowModal(false)}>
              변경
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
