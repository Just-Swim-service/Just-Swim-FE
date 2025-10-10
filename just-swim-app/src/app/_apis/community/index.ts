import { HTTP_METHODS } from '@data';
import api from '../api';

export interface CommunityPost {
  communityId: number;
  title: string;
  content: string;
  workoutData?: any;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  user: {
    userId: number;
    name: string;
    profileImage?: string;
  };
  communityCreatedAt: string;
  communityUpdatedAt: string;
  communityDeletedAt?: string;
}

export interface CreateCommunityDto {
  title: string;
  content: string;
  workoutData?: any;
}

export interface UpdateCommunityDto {
  title?: string;
  content?: string;
  workoutData?: any;
}

export interface CreateCommentDto {
  content: string;
  parentCommentId?: number;
}

export interface CommunityComment {
  commentId: number;
  content: string;
  likeCount: number;
  user: {
    userId: number;
    userName: string;
    profileImage?: string;
  };
  parentComment?: CommunityComment;
  parentCommentId?: number; // 대댓글을 위한 부모 댓글 ID
  replies?: CommunityComment[];
  commentCreatedAt: string;
  commentUpdatedAt: string;
}

export interface PaginatedResponse<T> {
  communities: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 게시글 목록 조회
export const getCommunities = async (
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedResponse<CommunityPost>> => {
  console.log('=== getCommunities 함수 시작! ===', page, limit); // 디버깅용

  try {
    const response = await api<any>(
      `/community?page=${page}&limit=${limit}`,
      HTTP_METHODS.GET,
    );

    // 실제 데이터는 response.data.data에 있음
    const actualData = response.data.data;

    // 데이터 변환: 문자열을 숫자로 변환
    const transformedCommunities = actualData.communities.map(
      (community: any) => ({
        ...community,
        communityId: parseInt(community.communityId),
        viewCount: parseInt(community.viewCount),
        likeCount: parseInt(community.likeCount),
        commentCount: parseInt(community.commentCount),
        user: {
          ...community.user,
          userId: parseInt(community.user.userId),
          name: community.user.name,
        },
      }),
    );

    return {
      communities: transformedCommunities,
      pagination: actualData.pagination,
    };
  } catch (error) {
    console.error('=== getCommunities 에러 ===', error); // 디버깅용
    throw error;
  }
};

// 게시글 상세 조회
export const getCommunityById = async (id: number): Promise<CommunityPost> => {
  console.log('=== getCommunityById 함수 시작! ===', id); // 디버깅용

  try {
    console.log('=== api 호출 전 ==='); // 디버깅용
    const response = await api<any>(`/community/${id}`, HTTP_METHODS.GET);
    console.log('=== api 응답 받음 ===', response); // 디버깅용

    // 실제 데이터는 response.data.data에 있음
    const actualData = response.data.data;

    // 데이터 변환: 문자열을 숫자로 변환
    const transformedPost = {
      ...actualData,
      communityId: parseInt(actualData.communityId),
      viewCount: parseInt(actualData.viewCount),
      likeCount: parseInt(actualData.likeCount),
      commentCount: parseInt(actualData.commentCount),
      user: {
        ...actualData.user,
        userId: parseInt(actualData.user.userId),
        name: actualData.user.name,
      },
    };

    console.log('=== 변환된 게시글 ===', transformedPost); // 디버깅용
    return transformedPost;
  } catch (error) {
    console.error('=== getCommunityById 에러 ===', error); // 디버깅용
    throw error;
  }
};

// 게시글 작성
export const createCommunity = async (
  data: CreateCommunityDto,
): Promise<CommunityPost> => {
  const response = await api<CommunityPost>('/community', HTTP_METHODS.POST, {
    body: JSON.stringify(data),
  });
  return response.data;
};

// 게시글 수정
export const updateCommunity = async (
  id: number,
  data: UpdateCommunityDto,
): Promise<CommunityPost> => {
  const response = await api<CommunityPost>(
    `/community/${id}`,
    HTTP_METHODS.PATCH,
    {
      body: JSON.stringify(data),
    },
  );
  return response.data;
};

// 게시글 삭제
export const deleteCommunity = async (id: number): Promise<void> => {
  await api<void>(`/community/${id}`, HTTP_METHODS.DELETE);
};

// 댓글 목록 조회
export const getComments = async (
  communityId: number,
): Promise<CommunityComment[]> => {
  const response = await api<any>(
    `/community/${communityId}/comments`,
    HTTP_METHODS.GET,
  );
  return response.data.data || [];
};

// 댓글 작성
export const createComment = async (
  communityId: number,
  data: CreateCommentDto,
): Promise<CommunityComment> => {
  const response = await api<CommunityComment>(
    `/community/${communityId}/comments`,
    HTTP_METHODS.POST,
    {
      body: JSON.stringify(data),
    },
  );
  return response.data;
};

// 댓글 수정
export const updateComment = async (
  commentId: number,
  content: string,
): Promise<CommunityComment> => {
  const response = await api<CommunityComment>(
    `/community/comments/${commentId}`,
    HTTP_METHODS.PATCH,
    {
      body: JSON.stringify({ content }),
    },
  );
  return response.data;
};

// 댓글 삭제
export const deleteComment = async (commentId: number): Promise<void> => {
  await api<void>(`/community/comments/${commentId}`, HTTP_METHODS.DELETE);
};

// 게시글 좋아요 토글
export const toggleCommunityLike = async (
  communityId: number,
): Promise<{ isLiked: boolean }> => {
  const response = await api<any>(
    `/community/${communityId}/like`,
    HTTP_METHODS.POST,
  );

  return response.data.data;
};

// 댓글 좋아요 토글
export const toggleCommentLike = async (
  commentId: number,
): Promise<{ isLiked: boolean }> => {
  const response = await api<any>(
    `/community/comments/${commentId}/like`,
    HTTP_METHODS.POST,
  );

  return response.data.data;
};
