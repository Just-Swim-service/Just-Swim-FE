'use client';

import Image from 'next/image';
import { URLImageProps } from '@types';

export const URLImage = (props: URLImageProps) => {
  const { priority = false, ...imageProps } = props;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Image
        src={props?.imageURL || ''}
        fill={true}
        object-fit="cover"
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...imageProps}
      />
    </div>
  );
};
