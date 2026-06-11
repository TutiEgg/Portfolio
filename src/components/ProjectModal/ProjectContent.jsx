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

function Figure({ src, alt, className = '', onImageOpen }) {
  const resolvedSrc = assetPath(src);

  return (
    <button
      type="button"
      onClick={() => onImageOpen?.({ src: resolvedSrc, alt })}
      aria-label={`Bild öffnen: ${alt}`}
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

export function ProjectContent({ blocks, title, onImageOpen }) {
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
          const alt = block.alt || `${title} — Abbildung ${index + 1}`;
          return (
            <figure key={key} className={styles.figure}>
              <Figure src={block.src} alt={alt} onImageOpen={onImageOpen} />
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
                    alt={img.alt || `${title} — Abbildung ${index + 1}.${i + 1}`}
                  />
                </figure>
              ))}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
