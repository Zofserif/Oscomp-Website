"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CompletedProject, ProjectMedia } from "../lib/projects";
import {
  formatProjectDate,
  getProjectImages,
  getProjectThumbnail,
  getYoutubeEmbedSrc,
  getYoutubePosterSrc,
} from "../lib/projects";

type ProjectGalleryProps = {
  projects: CompletedProject[];
};

export function ProjectGallery({ projects }: ProjectGalleryProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const activeProject = useMemo(
    () => projects.find((project) => project.slug === activeSlug) ?? null,
    [activeSlug, projects]
  );
  const activeMedia = activeProject?.media[activeMediaIndex] ?? null;

  const closeModal = useCallback(() => {
    setActiveSlug(null);
    setActiveMediaIndex(0);
    window.setTimeout(() => lastTriggerRef.current?.focus(), 0);
  }, []);

  const showPrevious = useCallback(() => {
    if (!activeProject) {
      return;
    }

    setActiveMediaIndex((current) =>
      current === 0 ? activeProject.media.length - 1 : current - 1
    );
  }, [activeProject]);

  const showNext = useCallback(() => {
    if (!activeProject) {
      return;
    }

    setActiveMediaIndex((current) =>
      current === activeProject.media.length - 1 ? 0 : current + 1
    );
  }, [activeProject]);

  useEffect(() => {
    if (!activeProject) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }

      if (event.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!firstElement || !lastElement) {
          return;
        }

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }

        if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeProject, closeModal, showNext, showPrevious]);

  function openProject(slug: string, trigger: HTMLElement) {
    lastTriggerRef.current = trigger;
    setActiveSlug(slug);
    setActiveMediaIndex(0);
  }

  function formatMediaCount(project: CompletedProject) {
    const imageCount = getProjectImages(project).length;
    const videoCount = project.media.filter(
      (item) => item.type === "youtube-video"
    ).length;
    const parts = [];

    if (imageCount > 0) {
      parts.push(`${imageCount} ${imageCount === 1 ? "photo" : "photos"}`);
    }

    if (videoCount > 0) {
      parts.push(`${videoCount} ${videoCount === 1 ? "video" : "videos"}`);
    }

    return parts.join(" / ");
  }

  function renderCardMedia(project: CompletedProject) {
    const thumbnail = getProjectThumbnail(project);

    if (!thumbnail) {
      return null;
    }

    if (thumbnail.type === "image") {
      return (
        <img
          src={thumbnail.src}
          alt={project.alt}
          loading="lazy"
          decoding="async"
        />
      );
    }

    const poster = getYoutubePosterSrc(thumbnail);

    if (poster) {
      return (
        <img
          src={poster}
          alt={thumbnail.title}
          loading="lazy"
          decoding="async"
        />
      );
    }

    return (
      <div className="project-video-placeholder" aria-hidden="true">
        <span className="material-icons">play_circle</span>
      </div>
    );
  }

  function renderModalMedia(media: ProjectMedia, project: CompletedProject) {
    if (media.type === "image") {
      return (
        <img
          className="project-modal-image"
          src={media.src}
          alt={media.alt}
        />
      );
    }

    const embedSrc = getYoutubeEmbedSrc(media.url);

    if (!embedSrc) {
      return (
        <div className="project-video-placeholder" role="img" aria-label={media.title}>
          <span className="material-icons" aria-hidden="true">
            play_circle
          </span>
        </div>
      );
    }

    return (
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="project-modal-video"
        key={media.url}
        src={embedSrc}
        title={media.title || `${project.title} video`}
      />
    );
  }

  function renderThumbnail(media: ProjectMedia) {
    if (media.type === "image") {
      return <img src={media.src} alt="" loading="lazy" decoding="async" />;
    }

    const poster = getYoutubePosterSrc(media);

    if (poster) {
      return <img src={poster} alt="" loading="lazy" decoding="async" />;
    }

    return (
      <span className="project-video-thumb" aria-hidden="true">
        <span className="material-icons">play_arrow</span>
      </span>
    );
  }

  return (
    <>
      <div className="project-grid project-blog-grid">
        {projects.map((project) => (
          <a
            className="project-card project-story-card"
            href={`#${project.slug}-photos`}
            key={project.slug}
            role="button"
            aria-label={`View project media for ${project.title}`}
            onClick={(event) => {
              event.preventDefault();
              openProject(project.slug, event.currentTarget);
            }}
            onKeyDown={(event) => {
              if (event.key === " ") {
                event.preventDefault();
                openProject(project.slug, event.currentTarget);
              }
            }}
          >
            <div className="project-card-media">
              {renderCardMedia(project)}
              <span className="project-photo-count">
                <span className="material-icons" aria-hidden="true">
                  collections
                </span>
                {formatMediaCount(project)}
              </span>
            </div>
            <div className="project-card-body">
              <div className="project-card-meta">
                <span className="badge bg-primary">{project.service}</span>
                <span>{project.location}</span>
                <time dateTime={project.completedAt}>
                  {formatProjectDate(project.completedAt)}
                </time>
              </div>
              <h2>{project.title}</h2>
              <p>{project.excerpt}</p>
              <p className="project-card-summary">{project.summary}</p>
              <div className="project-card-tags" aria-label="Project tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <span className="project-card-action">
                View project media
                <span className="material-icons" aria-hidden="true">
                  arrow_forward
                </span>
              </span>
            </div>
          </a>
        ))}
      </div>

      {activeProject ? (
        <div
          className="project-modal-backdrop"
          onClick={closeModal}
          role="presentation"
        >
          <div
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            aria-describedby="project-modal-summary"
            onClick={(event) => event.stopPropagation()}
            ref={modalRef}
          >
            <div className="project-modal-header">
              <div>
                <p className="eyebrow">{activeProject.service}</p>
                <h2 id="project-modal-title">{activeProject.title}</h2>
              </div>
              <button
                className="project-modal-close"
                type="button"
                aria-label="Close project media"
                onClick={closeModal}
                ref={closeButtonRef}
              >
                <span className="material-icons" aria-hidden="true">
                  close
                </span>
              </button>
            </div>

            <div className="project-modal-grid">
              <div className="project-modal-media">
                {activeMedia ? renderModalMedia(activeMedia, activeProject) : null}
                {activeProject.media.length > 1 ? (
                  <div
                    className="project-modal-controls"
                    aria-label={`${activeProject.title} media controls`}
                  >
                    <button
                      type="button"
                      onClick={showPrevious}
                      aria-label="Show previous project media"
                    >
                      <span aria-hidden="true">‹</span>
                    </button>
                    <button
                      type="button"
                      onClick={showNext}
                      aria-label="Show next project media"
                    >
                      <span aria-hidden="true">›</span>
                    </button>
                  </div>
                ) : null}
                <div
                  className="project-modal-thumbnails"
                  id={`${activeProject.slug}-photos`}
                  aria-label={`${activeProject.title} media thumbnails`}
                >
                  {activeProject.media.map((media, index) => (
                    <button
                      className={index === activeMediaIndex ? "active" : ""}
                      key={
                        media.type === "image"
                          ? media.src
                          : `youtube-video-${media.url}`
                      }
                      type="button"
                      aria-label={`Show project ${
                        media.type === "image" ? "photo" : "video"
                      } ${index + 1}`}
                      aria-current={
                        index === activeMediaIndex ? "true" : undefined
                      }
                      onClick={() => setActiveMediaIndex(index)}
                    >
                      {renderThumbnail(media)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="project-modal-copy">
                <div className="project-modal-facts">
                  <span>{activeProject.location}</span>
                  <time dateTime={activeProject.completedAt}>
                    {formatProjectDate(activeProject.completedAt)}
                  </time>
                </div>
                <p id="project-modal-summary">{activeProject.summary}</p>
                <div className="project-card-tags" aria-label="Project tags">
                  {activeProject.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
