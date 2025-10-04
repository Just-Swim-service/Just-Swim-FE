'use client';

import Image from 'next/image';
import { useState } from 'react';
import { URLImageProps } from '@types';
import NoProfile from '@/_assets/images/no_profile.png';

export const URLImage = (props: URLImageProps) => {
  const { priority = false, ...imageProps } = props;
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Image
        src={imageError || !props?.imageURL ? NoProfile : props.imageURL}
        fill={true}
        object-fit="cover"
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={handleImageError}
        onLoad={handleImageLoad}
        {...imageProps}
      />
    </div>
  );
};
