import Image, { ImageLoaderProps } from 'next/image';

type URLImageProps = {
  imageURL: string;
  alt: string;
};

export const URLImage = (props: URLImageProps) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Image
        src={props.imageURL}
        alt={props.alt}
        fill={true}
        object-fit="cover"
        priority
      />
    </div>
  );
};
