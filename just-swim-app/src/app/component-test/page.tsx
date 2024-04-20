import FixHeader from './_test/FixHeader';
import ProfileHeader from './_test/ProfileHeader';
import profile from './gallery.svg';

export default function Page() {
  const leftContent = '피드백';
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
        <ProfileHeader leftContent={leftContent} data={user} />
      </div>
      <div>
        <FixHeader
          leftContent={leftContent}
          data={feedback}
        />
      </div>
    </>
  );
}
