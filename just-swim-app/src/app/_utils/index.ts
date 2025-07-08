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

// 동영상 썸네일 생성 유틸리티
export const generateVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let objectURL: string;

    video.onloadedmetadata = () => {
      // 동영상의 첫 프레임에서 썸네일 생성 (0초 지점)
      video.currentTime = 0;
    };

    video.onseeked = () => {
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
    };

    video.onerror = () => {
      console.error('Video loading error:', file.name);
      URL.revokeObjectURL(objectURL);
      reject(new Error('Failed to load video'));
    };

    objectURL = URL.createObjectURL(file);
    video.src = objectURL;
  });
};

// 동영상 길이 가져오기
export const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    let objectURL: string;

    video.onloadedmetadata = () => {
      const duration = video.duration;
      URL.revokeObjectURL(objectURL);
      resolve(duration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectURL);
      reject(new Error('Failed to load video'));
    };

    objectURL = URL.createObjectURL(file);
    video.src = objectURL;
  });
};

// 파일 타입 확인
export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};
