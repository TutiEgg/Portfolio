import styles from './ProjectModal.module.css';

const HEADING_MAP = {
  2: 'h3',
  3: 'h4',
  4: 'h5',
};

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

function Figure({ src, alt, className = '' }) {
  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.figureLink} ${className}`.trim()}
    >
      <img
        src={src}
        alt={alt}
        className={styles.inlineImage}
        loading="lazy"
      />
    </a>
  );
}

export function ProjectContent({ blocks, title }) {
  if (!blocks?.length) return null;

  return (
    <div className={styles.article}>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        if (block.type === 'heading') {
          const level = block.level >= 2 && block.level <= 4 ? block.level : 3;
          const Tag = HEADING_MAP[level];
          const headingClass = styles[`articleMd${level}`];
          return (
            <Tag key={key} className={headingClass}>
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
              <Figure src={block.src} alt={alt} />
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
