// import styles from './_component/onBoarding/OnBoarding.module.css';
import  './Common.scss';

export default function Layout({children}: { children: React.ReactNode }) {
  return (
    <div className="container">
      {children}
    </div>
  );
}