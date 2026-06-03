"use client";

import { useEffect, useState } from "react";
import type { ServiceMedia } from "../lib/services";

type ImageCarouselProps = {
  id: string;
  media: ServiceMedia[];
  alt: string;
};

function toggleNativeVideo(video: HTMLVideoElement) {
  if (video.paused) {
    void video.play();
    return;
  }

  video.pause();
}

export function ImageCarousel({ id, media, alt }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualChangeCount, setManualChangeCount] = useState(0);
  const safeActiveIndex = media.length > 0 ? activeIndex % media.length : 0;
  const activeMedia = media[safeActiveIndex];

  useEffect(() => {
    if (media.length <= 1 || activeMedia?.type === "video") return undefined;

    const slideTimer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % media.length);
    }, 4000);

    return () => window.clearInterval(slideTimer);
  }, [activeMedia?.type, media.length, manualChangeCount]);

  if (!activeMedia) {
    return null;
  }

  function setManualMedia(nextIndex: number) {
    setActiveIndex((nextIndex + media.length) % media.length);
    setManualChangeCount((count) => count + 1);
  }

  return (
    <div className="image-gallery" id={id}>
      <div className="image-gallery-frame">
        {activeMedia.type === "image" ? (
          <img
            className="image-gallery-image"
            src={activeMedia.src}
            alt={activeMedia.alt ?? `${alt} ${safeActiveIndex + 1}`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <video
            className="image-gallery-video"
            src={activeMedia.src}
            autoPlay
            muted
            playsInline
            preload="metadata"
            title={activeMedia.title ?? `${alt} video ${safeActiveIndex + 1}`}
            onClick={(event) => toggleNativeVideo(event.currentTarget)}
          />
        )}
        {media.length > 1 ? (
          <div className="image-gallery-controls" aria-label={`${alt} gallery controls`}>
            <button
              type="button"
              onClick={() => setManualMedia(safeActiveIndex - 1)}
              aria-label="Show previous media"
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              type="button"
              onClick={() => setManualMedia(safeActiveIndex + 1)}
              aria-label="Show next media"
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
        ) : null}
      </div>
      {media.length > 1 ? (
        <div className="image-gallery-strip" aria-label={`${alt} thumbnails`}>
          {media.map((mediaItem, index) => (
            <button
              className={index === safeActiveIndex ? "active" : ""}
              key={mediaItem.src}
              type="button"
              onClick={() => setManualMedia(index)}
              aria-label={`Show ${mediaItem.type} ${index + 1}`}
              aria-current={index === safeActiveIndex ? "true" : "false"}
            >
              {mediaItem.type === "image" ? (
                <img src={mediaItem.src} alt="" loading="lazy" decoding="async" />
              ) : (
                <span className="image-gallery-video-thumb" aria-hidden="true">
                  <span className="material-icons">play_arrow</span>
                </span>
              )}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
