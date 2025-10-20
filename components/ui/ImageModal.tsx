import React from 'react';
import Image from 'next/image';
import { Button } from './button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  onPrevious?: () => void;
  onNext?: () => void;
  hasNavigation?: boolean;
}

const ImageModal: React.FC<ImageModalProps> = ({ 
  open, 
  onClose, 
  src, 
  alt,
  onPrevious,
  onNext,
  hasNavigation = false
}) => {
  if (!open) return null;

  const handleClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={handleClick}
    >
      <div className="relative w-[90vw] h-[90vh] flex items-center justify-center">
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="outline"
            size="icon"
            className="bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative w-full h-full">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            quality={100}
            sizes="90vw"
          />
          {hasNavigation && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrevious?.();
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onNext?.();
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal; 