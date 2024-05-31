import Image from 'next/image';
import './classContent.scss';
import Location from '/public/assets/location.svg';
import ClassDay from '/public/assets/class_day.svg';

export default function ClassContent({ item }: { item: any }) {
  return (
    <>
      <div className="class_content_wrapper">
        <div className="class_time">
          <p>오전</p>
          <p>07시</p>
        </div>
        <div
          className="content"
          style={{ boxShadow: `3px 0 0 0 ${item.picker} inset` }}>
          <div className="class_info">
            <div className="first_info">
              <p className="class_name" style={{ color: `${item.picker}` }}>
                {item.name}
              </p>
              <p className="class_info">{item.target}</p>
            </div>
            <div className="second_info">
              <p className="class_day">
                <ClassDay />
                {item.week}
              </p>
              <span></span>
              <p className="class_location">
                <Location />
                {item.location}
              </p>
            </div>
          </div>
          <div className="student_info">
            {/* 3개까지만 보여줘야함... */}
            {item.students?.slice(0, 3).map((student: any) => (
              <div key={student.name} className="student">
                <Image
                  key={student.name}
                  src={student.image}
                  alt="프로필"
                  width={20}
                  height={20}
                />
              </div>
            ))}
            {item.students?.length > 0 ? (
              <div className="student" style={{ color: `${item.picker}` }}>
                <p>{item.students?.length}명</p>
              </div>
            ) : (
              <div className="empty_student" style={{ color: `${item.picker}` }}>
                <p>초대된 수강생이 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
