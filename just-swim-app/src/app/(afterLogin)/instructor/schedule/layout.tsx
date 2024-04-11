import Monthly from './monthly/layout';
import Weekly from './weekly/page';

// export default function Layout({ children }: { children: React.ReactNode }) {
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h3>탭</h3>
      {children}
    </>
  );
}
