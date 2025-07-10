export * from './api';
export * from './date';
export * from './numberFormat';
export * from './optimization';
export * from './randomId';
export * from './refs';
export * from './sort';
export * from './token';
export * from './server';
export * from './fetchJson';

export const generateVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 브라우저 지원 확인
    if (typeof document === 'undefined') {
      reject(new Error('브라우저 환경이 아닙니다'));
      return;
    }

    try {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let objectURL: string;

      // 비디오 로드 타임아웃 설정
      const timeout = setTimeout(() => {
        URL.revokeObjectURL(objectURL);
        reject(new Error('비디오 로드 타임아웃'));
      }, 10000); // 10초 타임아웃

      video.onloadedmetadata = () => {
        try {
          clearTimeout(timeout);
          // 동영상의 첫 프레임에서 썸네일 생성 (0초 지점)
          video.currentTime = 0;
        } catch (error) {
          clearTimeout(timeout);
          URL.revokeObjectURL(objectURL);
          reject(new Error('비디오 메타데이터 로드 실패'));
        }
      };

      video.onseeked = () => {
        try {
          clearTimeout(timeout);
          if (ctx) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
            console.log(
              'Generated thumbnail for:',
              file.name,
              'Size:',
              thumbnail.length,
            );
            // 메모리 정리
            URL.revokeObjectURL(objectURL);
            resolve(thumbnail);
          } else {
            URL.revokeObjectURL(objectURL);
            reject(new Error('Canvas context not available'));
          }
        } catch (error) {
          clearTimeout(timeout);
          URL.revokeObjectURL(objectURL);
          reject(new Error('썸네일 생성 실패'));
        }
      };

      video.onerror = () => {
        clearTimeout(timeout);
        console.error('Video loading error:', file.name);
        URL.revokeObjectURL(objectURL);
        reject(new Error('Failed to load video'));
      };

      objectURL = URL.createObjectURL(file);
      video.src = objectURL;
    } catch (error) {
      reject(new Error('비디오 처리 초기화 실패'));
    }
  });
};

// 동영상 길이 가져오기
export const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    // 브라우저 지원 확인
    if (typeof document === 'undefined') {
      reject(new Error('브라우저 환경이 아닙니다'));
      return;
    }

    try {
      const video = document.createElement('video');
      let objectURL: string;

      // 비디오 로드 타임아웃 설정
      const timeout = setTimeout(() => {
        URL.revokeObjectURL(objectURL);
        reject(new Error('비디오 로드 타임아웃'));
      }, 10000); // 10초 타임아웃

      video.onloadedmetadata = () => {
        try {
          clearTimeout(timeout);
          const duration = video.duration;
          URL.revokeObjectURL(objectURL);
          resolve(duration);
        } catch (error) {
          clearTimeout(timeout);
          URL.revokeObjectURL(objectURL);
          reject(new Error('비디오 길이 추출 실패'));
        }
      };

      video.onerror = () => {
        clearTimeout(timeout);
        URL.revokeObjectURL(objectURL);
        reject(new Error('Failed to load video'));
      };

      objectURL = URL.createObjectURL(file);
      video.src = objectURL;
    } catch (error) {
      reject(new Error('비디오 처리 초기화 실패'));
    }
  });
};

// 파일 타입 확인
export const isVideoFile = (file: File): boolean => {
  if (!file?.type) {
    console.warn('[WARN] 파일 타입이 없습니다', file);
    return false;
  }
  return file.type.startsWith('video/');
};

export const isImageFile = (file: File): boolean => {
  if (!file?.type) {
    console.warn('[WARN] 파일 타입이 없습니다', file);
    return false;
  }
  return file.type.startsWith('image/');
};
