import Image, { ImageLoaderProps } from 'next/image';

type URLImageProps = {
  imageURL: string;
  alt: string;
  width: number;
  height: number;
};

const imageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  return `${src}?w=${width}&q=${quality}`;
};

export const URLImage = (props: URLImageProps) => {
  return (
    <>
      <Image
        loader={imageLoader}
        src={props.imageURL}
        alt={props.alt}
        width={props.width}
        height={props.height}
        priority
      />
    </>
  );
};
