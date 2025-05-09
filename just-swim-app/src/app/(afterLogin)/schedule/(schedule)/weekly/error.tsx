'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error('📛 /schedule/weekly 에러 발생:', error);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>⛔ 에러가 발생했습니다</h2>
      <p>{error.message}</p>
      <button onClick={reset} style={{ marginTop: '1rem' }}>
        다시 시도하기
      </button>
    </div>
  );
}
