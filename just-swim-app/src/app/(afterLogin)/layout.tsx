import  './common.scss';

export default function Layout({children}: { children: React.ReactNode }) {
  return (
    <div className="container">
      {children}
    </div>
  );
}