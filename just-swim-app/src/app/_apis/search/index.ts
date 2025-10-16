import { HTTP_METHODS } from '@data';
import api from '../api';

// 공통 검색 관련 인터페이스
export interface SearchParams {
  query?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'recent' | 'popular' | 'relevance';
  page?: number;
  limit?: number;
}

export interface SearchResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  searchQuery?: string;
  searchParams?: SearchParams;
}

export interface SearchSuggestion {
  suggestions: string[];
  type: 'title' | 'content' | 'tag';
}

// 검색 가능한 모듈 목록 조회
export const getAvailableSearchModules = async (): Promise<{
  modules: string[];
}> => {
  const response = await api<any>('/search/modules', HTTP_METHODS.GET);
  return response.data.data;
};

// 특정 모듈에서 통합 검색
export const searchModule = async <T>(
  module: string,
  query: string,
  page: number = 1,
  limit: number = 10,
  sortBy: 'recent' | 'popular' | 'relevance' = 'relevance',
): Promise<SearchResult<T>> => {
  const response = await api<any>(
    `/search/${module}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&sortBy=${sortBy}`,
    HTTP_METHODS.GET,
  );

  const actualData = response.data.data;

  return {
    ...actualData,
    items: actualData.items || actualData.communities || [],
  };
};

// 특정 모듈에서 고급 검색
export const advancedSearchModule = async <T>(
  module: string,
  searchParams: SearchParams,
  page: number = 1,
  limit: number = 10,
): Promise<SearchResult<T>> => {
  const params = new URLSearchParams();

  if (searchParams.query) params.append('q', searchParams.query);
  if (searchParams.startDate) params.append('startDate', searchParams.startDate);
  if (searchParams.endDate) params.append('endDate', searchParams.endDate);
  if (searchParams.sortBy) params.append('sortBy', searchParams.sortBy);

  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const response = await api<any>(
    `/search/${module}/search/advanced?${params.toString()}`,
    HTTP_METHODS.GET,
  );

  const actualData = response.data.data;

  return {
    ...actualData,
    items: actualData.items || actualData.communities || [],
  };
};

// 특정 모듈에서 검색어 자동완성
export const getModuleSearchSuggestions = async (
  module: string,
  query: string,
  limit: number = 5,
): Promise<SearchSuggestion[]> => {
  const response = await api<any>(
    `/search/${module}/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`,
    HTTP_METHODS.GET,
  );
  return response.data.data || [];
};

// 특정 모듈에서 관련 태그 추천
export const getModuleRelatedTags = async (
  module: string,
  query: string,
  limit: number = 10,
): Promise<any[]> => {
  const response = await api<any>(
    `/search/${module}/search/related-tags?q=${encodeURIComponent(query)}&limit=${limit}`,
    HTTP_METHODS.GET,
  );
  return response.data.data || [];
};

// 커뮤니티 검색 (기존 API와 호환성 유지)
export const searchCommunities = async (
  query: string,
  page: number = 1,
  limit: number = 10,
  sortBy: 'recent' | 'popular' | 'relevance' = 'relevance',
) => {
  return searchModule('community', query, page, limit, sortBy);
};

export const advancedSearchCommunities = async (
  searchParams: SearchParams,
  page: number = 1,
  limit: number = 10,
) => {
  return advancedSearchModule('community', searchParams, page, limit);
};

export const getSearchSuggestions = async (query: string, limit: number = 5) => {
  return getModuleSearchSuggestions('community', query, limit);
};

export const getRelatedTags = async (query: string, limit: number = 10) => {
  return getModuleRelatedTags('community', query, limit);
};
