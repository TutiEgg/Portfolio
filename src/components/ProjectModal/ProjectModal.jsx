import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll.js';
import { assetPath } from '../../utils/assetPath.js';
import { TechStackTags } from '../TechStackTags/TechStackTags.jsx';
import { ProjectContent, sectionAnchorId } from './ProjectContent.jsx';
import styles from './ProjectModal.module.css';

/**
 * Animated project detail overlay.
 * Closes on backdrop click, ESC key and the close button.
 * Supports either a README-style `content` block array (text + images interleaved)
 * or legacy `fullDescription` + optional `gallery`.
 */

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.25, ease: [0.65, 0, 0.35, 1] },
  },
};

export function ProjectModal({ project, onClose }) {
  const isOpen = Boolean(project);
  const projectImage = assetPath(project?.image);
  const [lightboxImage, setLightboxImage] = useState(null);
  useLockBodyScroll(isOpen);

  const sections = useMemo(() => {
    if (!project?.content?.length) return [];
    let sectionIndex = 0;
    return project.content
      .filter((block) => block.type === 'heading' && block.level === 2)
      .map((block) => ({
        id: sectionAnchorId(block.text, sectionIndex++),
        label: block.text,
      }));
  }, [project]);

  const openLightbox = useCallback((image) => {
    setLightboxImage(image);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxImage(null);
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key !== 'Escape') return;
      if (lightboxImage) closeLightbox();
      else onClose();
    },
    [closeLightbox, lightboxImage, onClose]
  );

  useEffect(() => {
    if (!isOpen) return undefined;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    setLightboxImage(null);
  }, [project?.id]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className={styles.backdrop}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
          onClick={onClose}
          role="presentation"
          data-testid="modal-backdrop"
        >
          <motion.div
            className={styles.dialog}
            variants={dialogVariants}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className={styles.close}
              aria-label="Schließen"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div
              className={styles.hero}
              style={{ backgroundImage: `url(${projectImage})` }}
              aria-hidden="true"
            >
              <div className={styles.heroOverlay} />
            </div>

            <div className={styles.content}>
              <div className={styles.meta}>
                <span className={styles.metaDate}>{project.exactDate}</span>
                {project.location && (
                  <>
                    <span className={styles.metaDivider} aria-hidden="true">
                      ·
                    </span>
                    <span className={styles.metaLocation}>{project.location}</span>
                  </>
                )}
              </div>

              <h2 id="project-modal-title" className={styles.title}>
                {project.title}
              </h2>

              <TechStackTags
                languages={project.languages}
                tags={project.tags}
              />

              {sections.length > 1 && (
                <nav className={styles.sectionNav} aria-label="Projektabschnitte">
                  {sections.map((section) => (
                    <a key={section.id} href={`#${section.id}`}>
                      {section.label}
                    </a>
                  ))}
                </nav>
              )}

              {project.content?.length > 0 ? (
                <ProjectContent
                  blocks={project.content}
                  title={project.title}
                  onImageOpen={openLightbox}
                />
              ) : (
                <>
                  {project.fullDescription && (
                    <div className={styles.body}>
                      {project.fullDescription
                        .split('\n\n')
                        .map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                  )}

                  {project.gallery?.length > 0 && (
                    <div className={styles.gallery}>
                      <h3 className={styles.galleryTitle}>
                        Abbildungen &amp; Formeln
                      </h3>
                      <ul className={styles.galleryGrid}>
                        {project.gallery.map((src, index) => (
                          <li key={src} className={styles.galleryItem}>
                            <a
                              href={assetPath(src)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.galleryLink}
                            >
                              <img
                                src={assetPath(src)}
                                alt={`${project.title} — Abbildung ${index + 1}`}
                                className={styles.galleryImage}
                                loading="lazy"
                              />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {project.links?.length > 0 && (
                <div className={styles.links}>
                  {project.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      {link.label}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M7 17L17 7M9 7h8v8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
          <AnimatePresence>
            {lightboxImage && (
              <motion.div
                className={styles.lightbox}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                role="dialog"
                aria-modal="true"
                aria-label="Bildansicht"
                onClick={(event) => {
                  event.stopPropagation();
                  closeLightbox();
                }}
              >
                <button
                  type="button"
                  className={styles.lightboxClose}
                  onClick={(event) => {
                    event.stopPropagation();
                    closeLightbox();
                  }}
                  aria-label="Bildansicht schließen"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <motion.figure
                  className={styles.lightboxFigure}
                  initial={{ scale: 0.96, y: 18 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.98, y: 10 }}
                  transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <img src={lightboxImage.src} alt={lightboxImage.alt} />
                  {lightboxImage.alt && <figcaption>{lightboxImage.alt}</figcaption>}
                </motion.figure>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
