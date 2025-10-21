import { HTTP_METHODS } from '@data';
import api from '../api';

// 카테고리 타입
export enum CategoryType {
  QUESTION = '질문',
  RECORD = '운동기록',
  TIP = '수영팁',
  REVIEW = '후기',
  STORY = '수영일상',
}

// 태그 인터페이스
export interface Tag {
  tagId: number;
  tagName: string;
  usageCount: number;
  tagCreatedAt: string;
  tagUpdatedAt: string;
}

export interface CommunityTag {
  tag: Tag;
}

export interface CommunityImage {
  imageId: number;
  imagePath: string;
  fileType: 'image' | 'video';
  fileName?: string;
  fileSize?: number;
  duration?: string;
  thumbnailPath?: string;
}

export interface CommunityPost {
  communityId: number;
  title: string;
  content: string;
  category: CategoryType;
  workoutData?: any;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  user: {
    userId: number;
    name: string;
    profileImage?: string;
  };
  images?: CommunityImage[];
  communityTags?: CommunityTag[];
  communityCreatedAt: string;
  communityUpdatedAt: string;
  communityDeletedAt?: string;
}

export interface CreateCommunityImageDto {
  filePath: string;
  fileType: 'image' | 'video';
  fileName?: string;
  fileSize?: number;
  duration?: string;
  thumbnailPath?: string;
}

export interface CreateCommunityDto {
  title: string;
  content: string;
  category?: CategoryType;
  tags?: string[];
  workoutData?: any;
  communityImages?: CreateCommunityImageDto[];
}

export interface UpdateCommunityDto {
  title?: string;
  content?: string;
  category?: CategoryType;
  tags?: string[];
  workoutData?: any;
  communityImages?: CreateCommunityImageDto[];
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

// 게시글 목록 조회 (카테고리/태그 필터 지원)
export const getCommunities = async (
  page: number = 1,
  limit: number = 10,
  category?: CategoryType,
  tags?: string[],
): Promise<PaginatedResponse<CommunityPost>> => {
  console.log('=== getCommunities 함수 시작! ===', page, limit, category, tags);

  try {
    let url = `/community?page=${page}&limit=${limit}`;
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }
    if (tags && tags.length > 0) {
      url += `&tags=${encodeURIComponent(tags.join(','))}`;
    }

    const response = await api<any>(url, HTTP_METHODS.GET);

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
    console.error('=== getCommunities 에러 ===', error);
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

// 인기 태그 목록 조회
export const getPopularTags = async (limit: number = 20): Promise<Tag[]> => {
  const response = await api<any>(
    `/community/tags/popular?limit=${limit}`,
    HTTP_METHODS.GET,
  );
  return response.data.data || [];
};

// 태그 자동완성 검색
export const searchTags = async (
  query: string,
  limit: number = 10,
): Promise<Tag[]> => {
  const response = await api<any>(
    `/community/tags/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    HTTP_METHODS.GET,
  );
  return response.data.data || [];
};

// 카테고리별 게시글 수 통계
export const getCategoryStats = async (): Promise<
  { category: CategoryType; count: number }[]
> => {
  const response = await api<any>(
    '/community/categories/stats',
    HTTP_METHODS.GET,
  );
  return response.data.data || [];
};

// 검색 관련 인터페이스
export interface SearchParams {
  query?: string;
  category?: CategoryType;
  tags?: string[];
  startDate?: string;
  endDate?: string;
  minLikes?: number;
  minComments?: number;
  sortBy?: 'recent' | 'popular' | 'relevance' | 'likes' | 'comments' | 'views';
}

export interface SearchResponse {
  communities: CommunityPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  searchQuery?: string;
  searchParams?: SearchParams;
  sortBy?: string;
}

export interface SearchSuggestion {
  suggestions: string[];
  type: 'title' | 'tag' | 'content';
}

// 통합 검색 (커뮤니티 검색 API 사용)
export const searchCommunities = async (
  query: string,
  page: number = 1,
  limit: number = 10,
  sortBy: 'recent' | 'popular' | 'relevance' = 'relevance',
): Promise<SearchResponse> => {
  const response = await api<any>(
    `/community/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&sortBy=${sortBy}`,
    HTTP_METHODS.GET,
  );

  const actualData = response.data.data;

  // 데이터 변환
  const transformedCommunities = (
    actualData.items ||
    actualData.communities ||
    []
  ).map((community: any) => ({
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
  }));

  return {
    ...actualData,
    communities: transformedCommunities,
  };
};

// 고급 검색
export const advancedSearchCommunities = async (
  searchParams: SearchParams,
  page: number = 1,
  limit: number = 10,
): Promise<SearchResponse> => {
  const params = new URLSearchParams();

  if (searchParams.query) params.append('q', searchParams.query);
  if (searchParams.category) params.append('category', searchParams.category);
  if (searchParams.tags && searchParams.tags.length > 0) {
    params.append('tags', searchParams.tags.join(','));
  }
  if (searchParams.startDate) params.append('startDate', searchParams.startDate);
  if (searchParams.endDate) params.append('endDate', searchParams.endDate);
  if (searchParams.minLikes !== undefined)
    params.append('minLikes', searchParams.minLikes.toString());
  if (searchParams.minComments !== undefined)
    params.append('minComments', searchParams.minComments.toString());
  if (searchParams.sortBy) params.append('sortBy', searchParams.sortBy);

  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const response = await api<any>(
    `/community/search/advanced?${params.toString()}`,
    HTTP_METHODS.GET,
  );

  const actualData = response.data.data;

  // 데이터 변환
  const transformedCommunities = (
    actualData.items ||
    actualData.communities ||
    []
  ).map((community: any) => ({
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
  }));

  return {
    ...actualData,
    communities: transformedCommunities,
  };
};

// 검색어 자동완성 (커뮤니티 검색 API 사용)
export const getSearchSuggestions = async (
  query: string,
  limit: number = 5,
): Promise<SearchSuggestion[]> => {
  const response = await api<any>(
    `/community/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`,
    HTTP_METHODS.GET,
  );
  return response.data.data || [];
};

// 관련 태그 추천 (커뮤니티 검색 API 사용)
export const getRelatedTags = async (
  query: string,
  limit: number = 10,
): Promise<Tag[]> => {
  const response = await api<any>(
    `/community/search/related-tags?q=${encodeURIComponent(query)}&limit=${limit}`,
    HTTP_METHODS.GET,
  );
  return response.data.data || [];
};
