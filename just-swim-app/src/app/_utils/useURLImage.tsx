import Image, { ImageLoaderProps } from 'next/image';

type URLImageProps = {
  imageURL: string;
  alt: string;
  width: number;
  height: number;
};

// TODO: URLImage 를 컴포넌트로 빼기
export const useURLImage = () => {
  const imageLoader = ({ src, width, quality }: ImageLoaderProps) => {
    return `${src}?w=${width}&q=${quality}`;
  };

  const URLImage = (props: URLImageProps) => {
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

  return { URLImage };
};
