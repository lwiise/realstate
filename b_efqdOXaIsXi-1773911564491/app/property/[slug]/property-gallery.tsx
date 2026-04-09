"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, Play } from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
  video?: string;
  title: string;
}

export function PropertyGallery({ images, video, title }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const allMedia = video
    ? [{ type: "video" as const, src: video }, ...images.map((img) => ({ type: "image" as const, src: img }))]
    : images.map((img) => ({ type: "image" as const, src: img }));

  if (allMedia.length === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center bg-black text-sm text-white/60">
        Aucun media disponible pour cette propriete.
      </div>
    );
  }

  const currentMedia = allMedia[currentIndex];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allMedia.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Media */}
        <div className="lg:col-span-3 relative aspect-[16/10] overflow-hidden bg-black group">
          {currentMedia.type === "video" ? (
            <video
              src={currentMedia.src}
              className="w-full h-full object-cover"
              controls
              controlsList="nodownload"
            />
          ) : (
            <Image
              src={currentMedia.src}
              alt={`${title} - Image ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
          )}
          
          {/* Navigation */}
          {allMedia.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-gold hover:text-black transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Previous media"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-gold hover:text-black transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Next media"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
          
          {/* Fullscreen */}
          {currentMedia.type === "image" && (
            <button
              onClick={() => setIsFullscreen(true)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-gold hover:text-black transition-colors opacity-0 group-hover:opacity-100"
              aria-label="View fullscreen"
            >
              <Expand className="w-4 h-4" />
            </button>
          )}
          
          {/* Counter */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white text-sm px-3 py-1.5">
            {currentIndex + 1} / {allMedia.length}
          </div>
        </div>
        
        {/* Thumbnails */}
        <div className="lg:col-span-1 grid grid-cols-3 lg:grid-cols-1 gap-4 auto-rows-max">
          {video && (
            <button
              onClick={() => setCurrentIndex(0)}
              className={`relative aspect-square lg:aspect-[4/3] overflow-hidden transition-all duration-300 bg-black flex items-center justify-center ${
                currentIndex === 0
                  ? "ring-2 ring-gold"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Play className="w-6 h-6 text-gold fill-gold" />
              </div>
              <span className="text-xs text-white bg-black/50 px-2 py-1">Vidéo</span>
            </button>
          )}
          {images.slice(0, video ? 2 : 3).map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(video ? index + 1 : index)}
              className={`relative aspect-square lg:aspect-[4/3] overflow-hidden transition-all duration-300 ${
                currentIndex === (video ? index + 1 : index)
                  ? "ring-2 ring-gold"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`${title} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 flex items-center justify-center text-white hover:bg-gold hover:text-black transition-colors"
            aria-label="Close fullscreen"
          >
            <span className="text-2xl">&times;</span>
          </button>

          <div className="relative w-full h-full max-w-7xl mx-auto p-4 flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={currentMedia.src}
                alt={`${title} - Image ${currentIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {allMedia.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 flex items-center justify-center text-white hover:bg-gold hover:text-black transition-colors"
                aria-label="Previous media"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 flex items-center justify-center text-white hover:bg-gold hover:text-black transition-colors"
                aria-label="Next media"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 text-white text-sm px-4 py-2">
            {currentIndex + 1} / {allMedia.length}
          </div>
        </div>
      )}
    </>
  );
}
