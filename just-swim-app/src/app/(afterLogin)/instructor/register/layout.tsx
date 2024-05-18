import EditHeader from '@/app/_component/Header/EditHeader';
import './classRegister.scss';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="register_wrapper">
        {/* TODO: 공통컴포넌트 이름을 바꿀 필요가 있다. */}
        <div className="register_header">
          <EditHeader leftContent="수업 등록하기" />
        </div>
        {children}
      </div>
    </>
  );
}
