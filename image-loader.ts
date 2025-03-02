interface ImageLoaderParams {
  src: string;
  _width?: number; // Prefixed with _ to indicate intentionally unused
  _quality?: number; // Prefixed with _ to indicate intentionally unused
}

const imageLoader = ({
  src,
  _width,
  _quality = 75,
}: ImageLoaderParams): string => {
  // For static exports, simply return the URL
  if (
    src.startsWith("data:") ||
    src.startsWith("blob:") ||
    src.startsWith("http")
  ) {
    return src;
  }

  // For local images, prefix with basePath if in production
  const basePath =
    process.env.NODE_ENV === "production" ? "/sistema-igreja" : "";
  return `${basePath}${src}`;
};

export default imageLoader;
