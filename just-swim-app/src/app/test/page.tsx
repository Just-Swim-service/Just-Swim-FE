import Header from './_test/Header';
import Header2 from './_test/Header2';
import profile from './gallery.svg';

export default function Page() {
  const leftContent = '피드백';
  const rightContent = '수정하기';
  const user = {
    name: '김재환',
    image: profile,
  };
  const feedback = {
    class: '아침A',
    dataUrl: '수업 정보 링크',
  };

  return (
    <>
      <div>
        <Header leftContent={leftContent} user={user} />
      </div>
      <div>
        <Header2
          leftContent={leftContent}
          rightContent={rightContent}
          feedback={feedback}
        />
      </div>
    </>
  );
}
