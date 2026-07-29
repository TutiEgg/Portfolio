import { useEffect, useState } from 'react';
import { COPY } from '../../data/copy.js';
import { assetPath } from '../../utils/assetPath.js';
import styles from './ProjectModal.module.css';

const HEADING_MAP = {
  2: 'h3',
  3: 'h4',
  4: 'h5',
};

export function sectionAnchorId(text, index) {
  const slug = String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

  return `section-${index}-${slug || 'details'}`;
}

/**
 * Renders README-style interleaved content blocks. Supported block types:
 *  - heading   ({ level: 2..4, text })
 *  - paragraph ({ text, markdown?: boolean })
 *  - image     ({ src, alt? })
 *  - imageRow  ({ images: [{ src, alt? }] }) — side-by-side figures
 *  - slideshow ({ title?, eyebrow?, images: [{ src, alt?, caption? }] })
 *  - list      ({ ordered?: boolean, items: [{ text }] })
 *
 * Heading levels follow Markdown depth (## = 2, ### = 3, #### = 4) and map to
 * h3..h5 so the dialog title stays the only h2 on the page.
 */

function renderInline(text) {
  if (!text) return null;
  // Render **bold** segments; everything else remains plain text.
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className={styles.inlineStrong}>
        {part}
      </strong>
    ) : (
      part
    )
  );
}

function Figure({ src, alt, className = '', copy = COPY.de.projectContent, onImageOpen }) {
  const resolvedSrc = assetPath(src);

  return (
    <button
      type="button"
      onClick={() => onImageOpen?.({ src: resolvedSrc, alt })}
      aria-label={copy.openImage(alt)}
      className={`${styles.figureLink} ${className}`.trim()}
    >
      <img
        src={resolvedSrc}
        alt={alt}
        className={styles.inlineImage}
        loading="lazy"
      />
    </button>
  );
}

function ArrowIcon({ direction }) {
  const path =
    direction === 'next'
      ? 'M9 18l6-6-6-6'
      : 'M15 18l-6-6 6-6';

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

function Slideshow({
  title,
  eyebrow,
  images = [],
  projectTitle,
  copy = COPY.de.projectContent,
  onImageOpen,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = images.length;
  const activeSlide = images[activeIndex] ?? images[0];

  useEffect(() => {
    setActiveIndex(0);
  }, [slideCount]);

  useEffect(() => {
    if (slideCount <= 1) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slideCount);
    }, 5200);

    return () => window.clearInterval(intervalId);
  }, [slideCount]);

  if (!slideCount) return null;

  const goToPrevious = () => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + slideCount) % slideCount);
  };

  const goToNext = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % slideCount);
  };

  const activeAlt =
    activeSlide.alt || copy.slideshowImage(projectTitle, activeIndex + 1);
  const activeSrc = assetPath(activeSlide.src);

  return (
    <section
      className={styles.slideshow}
      aria-label={title || copy.slideshowGallery(projectTitle)}
    >
      <button
        type="button"
        className={styles.slideshowImageButton}
        onClick={() => onImageOpen?.({ src: activeSrc, alt: activeAlt })}
        aria-label={copy.openImage(activeAlt)}
      >
        {images.map((slide, index) => (
          <img
            key={slide.src}
            src={assetPath(slide.src)}
            alt={slide.alt || copy.slideshowImage(projectTitle, index + 1)}
            className={`${styles.slideshowImage} ${
              index === activeIndex ? styles.slideshowImageActive : ''
            }`.trim()}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        ))}
      </button>

      <div className={styles.slideshowChrome}>
        <div className={styles.slideshowText}>
          {eyebrow && <span className={styles.slideshowEyebrow}>{eyebrow}</span>}
          {title && <h4 className={styles.slideshowTitle}>{title}</h4>}
          {activeSlide.caption && (
            <p className={styles.slideshowCaption}>{activeSlide.caption}</p>
          )}
        </div>

        {slideCount > 1 && (
          <div className={styles.slideshowControls}>
            <button
              type="button"
              className={styles.slideshowControl}
              onClick={goToPrevious}
              aria-label={copy.previousImage}
            >
              <ArrowIcon direction="previous" />
            </button>
            <button
              type="button"
              className={styles.slideshowControl}
              onClick={goToNext}
              aria-label={copy.nextImage}
            >
              <ArrowIcon direction="next" />
            </button>
          </div>
        )}
      </div>

      {slideCount > 1 && (
        <div className={styles.slideshowDots}>
          {images.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              className={`${styles.slideshowDot} ${
                index === activeIndex ? styles.slideshowDotActive : ''
              }`.trim()}
              onClick={() => setActiveIndex(index)}
              aria-label={copy.showImage(index + 1)}
              aria-pressed={index === activeIndex}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export function ProjectContent({
  blocks,
  title,
  copy = COPY.de.projectContent,
  onImageOpen,
}) {
  if (!blocks?.length) return null;

  return (
    <div className={styles.article}>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        if (block.type === 'heading') {
          const level = block.level >= 2 && block.level <= 4 ? block.level : 3;
          const Tag = HEADING_MAP[level];
          const headingClass = styles[`articleMd${level}`];
          const sectionIndex = blocks
            .slice(0, index)
            .filter((item) => item.type === 'heading' && item.level === 2)
            .length;
          const headingId =
            level === 2 ? sectionAnchorId(block.text, sectionIndex) : undefined;

          return (
            <Tag key={key} id={headingId} className={headingClass}>
              {block.text}
            </Tag>
          );
        }

        if (block.type === 'paragraph') {
          return (
            <p key={key} className={styles.articleP}>
              {renderInline(block.text)}
            </p>
          );
        }

        if (block.type === 'list') {
          const Tag = block.ordered ? 'ol' : 'ul';
          return (
            <Tag
              key={key}
              className={`${styles.articleList} ${
                block.ordered ? styles.articleListOrdered : ''
              }`.trim()}
            >
              {(block.items ?? []).map((item, i) => (
                <li key={i} className={styles.articleListItem}>
                  {renderInline(typeof item === 'string' ? item : item.text)}
                </li>
              ))}
            </Tag>
          );
        }

        if (block.type === 'image') {
          const alt = block.alt || copy.figureAlt(title, index + 1);
          return (
            <figure key={key} className={styles.figure}>
              <Figure src={block.src} alt={alt} copy={copy} onImageOpen={onImageOpen} />
            </figure>
          );
        }

        if (block.type === 'imageRow') {
          const images = block.images ?? [];
          return (
            <div
              key={key}
              className={styles.figureRow}
              style={{
                gridTemplateColumns: `repeat(${Math.min(
                  images.length,
                  4
                )}, minmax(0, 1fr))`,
              }}
            >
              {images.map((img, i) => (
                <figure key={i} className={styles.figure}>
                  <Figure
                    src={img.src}
                    onImageOpen={onImageOpen}
                    copy={copy}
                    alt={img.alt || copy.figureAlt(title, `${index + 1}.${i + 1}`)}
                  />
                </figure>
              ))}
            </div>
          );
        }

        if (block.type === 'slideshow') {
          return (
            <Slideshow
              key={key}
              title={block.title}
              eyebrow={block.eyebrow}
              images={block.images}
              projectTitle={title}
              copy={copy}
              onImageOpen={onImageOpen}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
