import styled from './classContent.module.scss';
import Image from 'next/image';
import Location from '/public/assets/location.svg';
import ClassDay from '/public/assets/class_day.svg';

export default function ClassContent({ item }: { item: any }) {
  return (
    <>
      <div className={styled.class_content_wrapper}>
        <div className={styled.class_time}>
          <p>오전</p>
          <p>07시</p>
        </div>
        <div
          className={styled.content}
          style={{ boxShadow: `3px 0 0 0 ${item.picker} inset` }}>
          <div className={styled.class_info}>
            <div className={styled.first_info}>
              <p
                className={styled.class_name}
                style={{ color: `${item.picker}` }}>
                {item.name}
              </p>
              <p className={styled.class_info}>{item.target}</p>
            </div>
            <div className={styled.second_info}>
              <p className={styled.class_day}>
                <ClassDay />
                {item.week}
              </p>
              <span></span>
              <p className={styled.class_location}>
                <Location />
                {item.location}
              </p>
            </div>
          </div>
          <div className={styled.student_info}>
            {/* 3개까지만 보여줘야함... */}
            {item.students?.slice(0, 3).map((student: any) => (
              <div key={student.name} className={styled.student}>
                <Image
                  key={student.name}
                  src={student.image}
                  alt={styled.프로필}
                  width={20}
                  height={20}
                />
              </div>
            ))}
            {item.students?.length > 0 ? (
              <div
                className={styled.student}
                style={{ color: `${item.picker}` }}>
                <p>{item.students?.length}명</p>
              </div>
            ) : (
              <div
                className={styled.empty_student}
                style={{ color: `${item.picker}` }}>
                <p>초대된 수강생이 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
