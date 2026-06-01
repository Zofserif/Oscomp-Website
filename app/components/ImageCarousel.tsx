"use client";

import { useEffect, useState } from "react";

type ImageCarouselProps = {
  id: string;
  images: string[];
  alt: string;
};

export function ImageCarousel({ id, images, alt }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualChangeCount, setManualChangeCount] = useState(0);
  const safeActiveIndex = images.length > 0 ? activeIndex % images.length : 0;
  const activeImage = images[safeActiveIndex];

  useEffect(() => {
    if (images.length <= 1) return undefined;

    const slideTimer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 4000);

    return () => window.clearInterval(slideTimer);
  }, [images.length, manualChangeCount]);

  if (!activeImage) {
    return null;
  }

  function setManualImage(nextIndex: number) {
    setActiveIndex((nextIndex + images.length) % images.length);
    setManualChangeCount((count) => count + 1);
  }

  return (
    <div className="image-gallery" id={id}>
      <div className="image-gallery-frame">
        <img
          className="image-gallery-image"
          src={activeImage}
          alt={`${alt} ${safeActiveIndex + 1}`}
          loading="lazy"
          decoding="async"
        />
        {images.length > 1 ? (
          <div className="image-gallery-controls" aria-label={`${alt} gallery controls`}>
            <button
              type="button"
              onClick={() => setManualImage(safeActiveIndex - 1)}
              aria-label="Show previous image"
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              type="button"
              onClick={() => setManualImage(safeActiveIndex + 1)}
              aria-label="Show next image"
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
        ) : null}
      </div>
      {images.length > 1 ? (
        <div className="image-gallery-strip" aria-label={`${alt} thumbnails`}>
          {images.map((image, index) => (
            <button
              className={index === safeActiveIndex ? "active" : ""}
              key={image}
              type="button"
              onClick={() => setManualImage(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === safeActiveIndex ? "true" : "false"}
            >
              <img src={image} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
