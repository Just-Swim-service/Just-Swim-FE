// export default function Layout({ children }: { children: React.ReactNode }) {
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h3>탭</h3>
      {/* 탭 정보 넘기기 */}
      {children}
    </>
  );
}
