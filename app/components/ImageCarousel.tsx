type ImageCarouselProps = {
  id: string;
  images: string[];
  alt: string;
};

export function ImageCarousel({ id, images, alt }: ImageCarouselProps) {
  const activeImage = images[0];
  const slideshowScript =
    images.length > 1
      ? `
(() => {
  const gallery = document.getElementById(${JSON.stringify(id)});
  if (!gallery || gallery.dataset.slideshowReady === "true") return;

  const images = ${JSON.stringify(images)};
  const alt = ${JSON.stringify(alt)};
  const mainImage = gallery.querySelector(".image-gallery-image");
  const thumbs = Array.from(gallery.querySelectorAll("[data-gallery-index]"));
  let activeIndex = 0;
  let slideTimer;

  function setActiveImage(nextIndex) {
    activeIndex = (nextIndex + images.length) % images.length;
    mainImage.src = images[activeIndex];
    mainImage.alt = alt + " " + (activeIndex + 1);
    thumbs.forEach((thumb, index) => {
      const isActive = index === activeIndex;
      thumb.classList.toggle("active", isActive);
      thumb.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function restartTimer() {
    window.clearInterval(slideTimer);
    slideTimer = window.setInterval(() => setActiveImage(activeIndex + 1), 4000);
  }

  gallery.querySelector("[data-gallery-prev]")?.addEventListener("click", () => {
    setActiveImage(activeIndex - 1);
    restartTimer();
  });
  gallery.querySelector("[data-gallery-next]")?.addEventListener("click", () => {
    setActiveImage(activeIndex + 1);
    restartTimer();
  });
  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      setActiveImage(index);
      restartTimer();
    });
  });

  gallery.dataset.slideshowReady = "true";
  restartTimer();
})();
`
      : "";

  return (
    <div className="image-gallery" id={id}>
      <div className="image-gallery-frame">
        <img
          className="image-gallery-image"
          src={activeImage}
          alt={`${alt} 1`}
          loading="lazy"
          decoding="async"
        />
        {images.length > 1 ? (
          <div className="image-gallery-controls" aria-label={`${alt} gallery controls`}>
            <button type="button" data-gallery-prev aria-label="Show previous image">
              <span aria-hidden="true">‹</span>
            </button>
            <button type="button" data-gallery-next aria-label="Show next image">
              <span aria-hidden="true">›</span>
            </button>
          </div>
        ) : null}
      </div>
      {images.length > 1 ? (
        <div className="image-gallery-strip" aria-label={`${alt} thumbnails`}>
          {images.map((image, index) => (
            <button
              className={index === 0 ? "active" : ""}
              key={image}
              type="button"
              data-gallery-index={index}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === 0 ? "true" : "false"}
            >
              <img src={image} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      ) : null}
      {slideshowScript ? (
        <script dangerouslySetInnerHTML={{ __html: slideshowScript }} />
      ) : null}
    </div>
  );
}
