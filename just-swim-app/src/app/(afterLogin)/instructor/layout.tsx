export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h1>GNB</h1>
      <h2>인사 문구</h2>
      {children}
    </>
  );
}
