'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { BottomNav, HistoryBackHeader, TagInput } from '@components';
import {
  getCommunityById,
  updateCommunity,
  type CommunityPost,
  CategoryType,
} from '@apis';
import { getMyProfile } from '@apis';

import styled from './styles.module.scss';

export default function CommunityEditPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: CategoryType.STORY,
    workoutData: null as any,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const communityId = parseInt(params.id as string);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 현재 사용자 정보와 게시글 정보를 병렬로 가져오기
        const [profileResponse, postResponse] = await Promise.all([
          getMyProfile(),
          getCommunityById(communityId),
        ]);

        setCurrentUserId(parseInt(profileResponse.data.data.userId));
        setPost(postResponse);

        // 작성자 권한 체크
        if (
          parseInt(profileResponse.data.data.userId) !== postResponse.user.userId
        ) {
          alert('게시글을 수정할 권한이 없습니다.');
          router.push(`/community/${communityId}`);
          return;
        }

        // 폼 데이터 초기화
        setFormData({
          title: postResponse.title,
          content: postResponse.content,
          category: postResponse.category || CategoryType.STORY,
          workoutData: postResponse.workoutData,
        });

        // 태그 초기화
        if (
          postResponse.communityTags &&
          postResponse.communityTags.length > 0
        ) {
          setSelectedTags(
            postResponse.communityTags.map((ct) => ct.tag.tagName),
          );
        }
      } catch (error) {
        console.error('데이터 조회 실패:', error);
        setError('게시글을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (communityId) {
      fetchData();
    }
  }, [communityId, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setSaving(true);
      await updateCommunity(communityId, {
        ...formData,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      });
      alert('게시글이 수정되었습니다.');
      router.push(`/community/${communityId}`);
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      alert('게시글 수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm('수정을 취소하시겠습니까? 변경사항이 저장되지 않습니다.')
    ) {
      router.push(`/community/${communityId}`);
    }
  };

  if (loading) {
    return (
      <div className={styled.container}>
        <HistoryBackHeader title="게시글 수정" />
        <div className={styled.loadingContainer}>
          <p>게시글을 불러오는 중...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styled.container}>
        <HistoryBackHeader title="게시글 수정" />
        <div className={styled.errorContainer}>
          <p>{error || '게시글을 찾을 수 없습니다.'}</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className={styled.container}>
      <HistoryBackHeader title="게시글 수정" />

      <div className={styled.edit_container}>
        <form onSubmit={handleSubmit} className={styled.edit_form}>
          {/* 제목 입력 */}
          <div className={styled.input_group}>
            <label htmlFor="title" className={styled.label}>
              제목
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={styled.title_input}
              placeholder="제목을 입력하세요"
              maxLength={100}
              required
            />
          </div>

          {/* 내용 입력 */}
          <div className={styled.input_group}>
            <label htmlFor="content" className={styled.label}>
              내용
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className={styled.content_textarea}
              placeholder="내용을 입력하세요"
              rows={10}
              required
            />
          </div>

          {/* 카테고리 선택 */}
          <div className={styled.input_group}>
            <label htmlFor="category" className={styled.label}>
              카테고리
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category: e.target.value as CategoryType,
                }))
              }
              className={styled.category_select}>
              <option value={CategoryType.STORY}>수영일상</option>
              <option value={CategoryType.QUESTION}>질문</option>
              <option value={CategoryType.RECORD}>운동기록</option>
              <option value={CategoryType.TIP}>수영팁</option>
              <option value={CategoryType.REVIEW}>후기</option>
            </select>
          </div>

          {/* 태그 입력 */}
          <div className={styled.input_group}>
            <label className={styled.label}>태그</label>
            <TagInput
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              maxTags={5}
            />
          </div>

          {/* 운동 정보 (읽기 전용) */}
          {formData.workoutData && (
            <div className={styled.workout_info}>
              <label className={styled.label}>운동 정보</label>
              <div className={styled.workout_display}>
                {Object.entries(formData.workoutData).map(([key, value]) => (
                  <span key={key} className={styled.workout_tag}>
                    {key}: {String(value)}
                  </span>
                ))}
              </div>
              <p className={styled.workout_note}>
                운동 정보는 수정할 수 없습니다.
              </p>
            </div>
          )}

          {/* 버튼 그룹 */}
          <div className={styled.button_group}>
            <button
              type="button"
              onClick={handleCancel}
              className={styled.cancel_button}
              disabled={saving}>
              취소
            </button>
            <button
              type="submit"
              className={styled.save_button}
              disabled={
                saving || !formData.title.trim() || !formData.content.trim()
              }>
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
