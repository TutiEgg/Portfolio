import { useEffect, useState } from 'react';
import { assetPath } from '../../utils/assetPath.js';
import styles from './ProjectImageSlideshow.module.css';

function ArrowIcon({ direction }) {
  const path =
    direction === 'next'
      ? 'M9 18l6-6-6-6'
      : 'M15 18l-6-6 6-6';

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={path}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProjectImageSlideshow({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = images.length;
  const activeImage = images[activeIndex] ?? images[0];

  useEffect(() => {
    setActiveIndex(0);
  }, [slideCount]);

  useEffect(() => {
    if (slideCount <= 1) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slideCount);
    }, 4800);

    return () => window.clearInterval(intervalId);
  }, [slideCount]);

  if (!slideCount) return null;

  const goToPrevious = () => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + slideCount) % slideCount);
  };

  const goToNext = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % slideCount);
  };

  return (
    <section
      className={styles.section}
      aria-labelledby="project-images-heading"
    >
      <div className={styles.header}>
        <p className={styles.eyebrow}>Projektbilder</p>
        <h2 id="project-images-heading" className={styles.heading}>
          Einblicke aus allen Projekten
        </h2>
      </div>

      <div className={styles.stage}>
        <img
          key={activeImage.src}
          src={assetPath(activeImage.src)}
          alt={activeImage.alt}
          className={styles.image}
        />

        <div className={styles.overlay}>
          <div className={styles.copy}>
            <span className={styles.projectTitle}>{activeImage.projectTitle}</span>
            {activeImage.caption && (
              <p className={styles.caption}>{activeImage.caption}</p>
            )}
          </div>

          {slideCount > 1 && (
            <div className={styles.controls}>
              <button
                type="button"
                className={styles.control}
                onClick={goToPrevious}
                aria-label="Vorheriges Projektbild"
              >
                <ArrowIcon direction="previous" />
              </button>
              <span className={styles.counter} aria-live="polite">
                {activeIndex + 1} / {slideCount}
              </span>
              <button
                type="button"
                className={styles.control}
                onClick={goToNext}
                aria-label="Nächstes Projektbild"
              >
                <ArrowIcon direction="next" />
              </button>
            </div>
          )}
        </div>

        <div
          className={styles.progress}
          aria-hidden="true"
          style={{ transform: `scaleX(${(activeIndex + 1) / slideCount})` }}
        />
      </div>
    </section>
  );
}
