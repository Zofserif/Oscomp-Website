"use client";

import { useState } from "react";

type ImageCarouselProps = {
  id: string;
  images: string[];
  alt: string;
};

export function ImageCarousel({ id, images, alt }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  function showPrevious() {
    setActiveIndex((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  }

  function showNext() {
    setActiveIndex((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  }

  return (
    <div className="image-gallery" id={id}>
      <div className="image-gallery-frame">
        <img
          className="image-gallery-image"
          src={activeImage}
          alt={`${alt} ${activeIndex + 1}`}
          loading="lazy"
          decoding="async"
        />
        {images.length > 1 ? (
          <div className="image-gallery-controls" aria-label={`${alt} gallery controls`}>
            <button type="button" onClick={showPrevious} aria-label="Show previous image">
              <span aria-hidden="true">‹</span>
            </button>
            <button type="button" onClick={showNext} aria-label="Show next image">
              <span aria-hidden="true">›</span>
            </button>
          </div>
        ) : null}
      </div>
      {images.length > 1 ? (
        <div className="image-gallery-strip" aria-label={`${alt} thumbnails`}>
          {images.map((image, index) => (
            <button
              className={index === activeIndex ? "active" : ""}
              key={image}
              type="button"
              aria-label={`Show image ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
            >
              <img src={image} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
