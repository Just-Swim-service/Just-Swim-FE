import  './common.scss';

export default function Layout({children}: { children: React.ReactNode }) {
  return (
    <div className="instructor_container">
      {children}
    </div>
  );
}