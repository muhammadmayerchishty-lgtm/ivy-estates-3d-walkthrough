import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackText?: string;
  aspectRatioClass?: string;
  containerClassName?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackText = 'IVY Architectural Showcase',
  aspectRatioClass = 'aspect-video',
  containerClassName = '',
  className = '',
  loading = 'lazy',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-[#0B0B0C] ${aspectRatioClass} ${containerClassName}`}
    >
      {/* Fallback gradient container if image fails */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#141310] via-[#0B0B0C] to-black border border-[#8A6A2B]/20">
          <Building2 className="w-8 h-8 text-[#E6C36A]/60 mb-2" />
          <span className="text-xs uppercase tracking-widest text-[#E6C36A] font-heading font-semibold">
            {fallbackText}
          </span>
          <span className="text-[11px] text-[#A89F8D] mt-1 font-sans">{alt}</span>
        </div>
      ) : (
        <>
          {/* Subtle loading placeholder shimmer */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-[#12110e] animate-pulse pointer-events-none" />
          )}

          <img
            src={src}
            alt={alt}
            loading={loading}
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-700 ease-out ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            {...rest}
          />
        </>
      )}
    </div>
  );
};
