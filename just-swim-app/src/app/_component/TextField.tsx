'use client';

import { useState } from 'react';
import './textField.scss';

interface Props {
  label: string;
  placeholder: string;
  type: string;
}

export default function TextField({ label, placeholder, type }: Props) {
  const [hasValue, setHasValue] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(event.target.value.length > 0);
  };

  return (
    <>
      <label>
        {label}
        <span>(필수)</span>
      </label>
      <div className="input_box">
        <input
          type={type}
          placeholder={placeholder}
          onChange={handleChange}
          className={hasValue ? 'filled' : ''}
        />
        {hasValue && (
          <span>
            <svg
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M14.6505 5.87658C15.1165 6.3787 15.1165 7.19278 14.6505 7.69489L8.68369 14.1234C8.45989 14.3645 8.15635 14.5 7.83984 14.5C7.52334 14.5 7.21979 14.3645 6.99599 14.1234L3.34953 10.1948C2.88349 9.69266 2.88349 8.87857 3.34953 8.37646C3.81558 7.87435 4.57119 7.87435 5.03724 8.37646L7.83984 11.396L12.9628 5.87658C13.4288 5.37447 14.1844 5.37447 14.6505 5.87658Z"
                fill="#3689FF"
              />
            </svg>
          </span>
        )}
      </div>
    </>
  );
}
