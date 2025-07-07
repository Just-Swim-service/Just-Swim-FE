import { HTTP_METHODS } from '@data';
import api from '../api';

const URL = `${process.env.NEXT_PUBLIC_API_URL}`;

// 캐시를 위한 Map
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5분

// 캐시 유효성 검사
const isCacheValid = (timestamp: number) => {
  return Date.now() - timestamp < CACHE_DURATION;
};

async function getMemberList() {
  const cacheKey = 'memberList';
  const cached = cache.get(cacheKey);

  // 캐시가 유효하면 캐시된 데이터 반환
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  try {
    const response = await api('/member', HTTP_METHODS.GET);

    // 성공한 응답을 캐시에 저장
    cache.set(cacheKey, {
      data: response,
      timestamp: Date.now(),
    });

    return response;
  } catch (error) {
    console.error('Failed to fetch member list:', error);

    // 캐시된 데이터가 있으면 반환 (stale-while-revalidate 패턴)
    if (cached) {
      return cached.data;
    }

    throw error;
  }
}

async function getClassList(): Promise<any> {
  const cacheKey = 'classList';
  const cached = cache.get(cacheKey);

  // 캐시가 유효하면 캐시된 데이터 반환
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  try {
    const response = await api('/lecture/myLectures', HTTP_METHODS.GET);

    // 성공한 응답을 캐시에 저장
    cache.set(cacheKey, {
      data: response,
      timestamp: Date.now(),
    });

    return response;
  } catch (error) {
    console.error('Failed to fetch class list:', error);

    // 캐시된 데이터가 있으면 반환
    if (cached) {
      return cached.data;
    }

    throw error;
  }
}

// 캐시 클리어 함수
export const clearCache = () => {
  cache.clear();
};

export { getMemberList, getClassList };
