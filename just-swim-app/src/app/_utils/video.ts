// 파일 타입 확인
export const isVideoFile = (file?: File): boolean => {
  if (!file || typeof file.type !== 'string') {
    console.warn('[isVideoFile] Invalid file:', file);
    return false;
  }

  return file.type.startsWith('video/');
};

export const isImageFile = (file?: File): boolean => {
  if (!file || typeof file.type !== 'string') {
    console.warn('[isImageFile] Invalid file:', file);
    return false;
  }

  return file.type.startsWith('image/');
};

// 썸네일 추출
export const generateVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.crossOrigin = 'anonymous';
    video.muted = true;

    video.addEventListener('loadeddata', () => {
      video.currentTime = 0.5;
    });

    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL);
      } else {
        resolve('');
      }
      URL.revokeObjectURL(video.src);
    });

    video.onerror = () => resolve('');
  });
};

export const dataURLtoBlob = (dataUrl: string) => {
  const [header, data] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(data);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
};
