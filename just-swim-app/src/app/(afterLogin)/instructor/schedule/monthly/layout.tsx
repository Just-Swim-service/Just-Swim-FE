export default function Layout({ children, modal }: { children: React.ReactNode ,modal: React.ReactNode }) {
  return (
    <>
      <h4>월간</h4>
      {children}
      {modal}
    </>
  );
}
