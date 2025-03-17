'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@components';
import { FeedbackInfo } from '@/_types/typeFeedback';

import styled from './feedbackInfoEdit.module.scss';

export default function FeedbackInfoEdit() {
  const params = useParams();
  const router = useRouter();

  const feedbackId = params.id;
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/feedback/${feedbackId}`;
  const AUTHORIZATION_HEADER = `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`;

  const [feedback, setFeedback] = useState<FeedbackInfo>();
  const [formData, setFormData] = useState({});

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: AUTHORIZATION_HEADER,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFeedback(data.data);
      });
  }, [feedbackId]);

  //  @ts-ignore
  if (!feedback || feedback.length === 0) {
    return null;
  }

  const isFormDataChanged = (feedbackData: object, formData: object) => {
    for (const key in formData) {
      //  @ts-ignore
      if (feedbackData[key] !== formData[key]) {
        return true;
      }
    }
    return false;
  };

  const handleEdit = async (feedbackId: number) => {
    try {
      const response = await fetch(API_URL, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: AUTHORIZATION_HEADER,
        },
        body: JSON.stringify(formData),
      });
      const updatedFeedbackData = await response.json();
      setFeedback(updatedFeedbackData);
      if (response.ok) {
        alert('수정되었습니다.');
        router.push(`/class/detail/${feedbackId}`);
      }
    } catch (error) {
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      {/* @ts-ignore */}
      <div key={feedbackId}>
        <Header title="피드백 수정하기" />
      </div>
    </div>
  );
}
