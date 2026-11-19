import { useState } from 'react';
import { FaImage, FaUser } from 'react-icons/fa';

export default function SkeletonImage({
  src,
  alt = '',
  className = '',
  wrapperClassName = '',
  isLoading = false,
  fallbackType = 'image',
  onClick,
}) {
  const [loadedSrc, setLoadedSrc] = useState(null);
  const [errorSrc, setErrorSrc] = useState(null);

  const loaded = Boolean(src) && loadedSrc === src;
  const hasError = Boolean(src) && errorSrc === src;

  const showSkeleton = isLoading || (Boolean(src) && !loaded && !hasError);
  const showFallback = !isLoading && (!src || hasError);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {showSkeleton && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 skeleton-shimmer flex items-center justify-center"
        >
          <div className="w-9 h-9 rounded-full border-4 border-black/20 border-t-black animate-spin" />
        </div>
      )}

      {showFallback ? (
        <div className="w-full h-full min-h-[inherit] bg-gray-100 flex flex-col items-center justify-center text-gray-400 p-4 select-none">
          {fallbackType === 'user' ? (
            <FaUser className="w-12 h-12 mb-2 opacity-60" />
          ) : (
            <FaImage className="w-10 h-10 mb-2 opacity-60" />
          )}
        </div>
      ) : (
        src && (
          <img
            src={src}
            alt={alt}
            onClick={onClick}
            onLoad={() => setLoadedSrc(src)}
            onError={() => setErrorSrc(src)}
            className={`${className} transition-opacity duration-500 ${
              loaded && !isLoading ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )
      )}
    </div>
  );
}
