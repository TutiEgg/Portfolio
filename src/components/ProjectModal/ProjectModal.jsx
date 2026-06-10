import { useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll.js';
import { TechStackTags } from '../TechStackTags/TechStackTags.jsx';
import { ProjectContent } from './ProjectContent.jsx';
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
  useLockBodyScroll(isOpen);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return undefined;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

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
              style={{ backgroundImage: `url(${project.image})` }}
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

              {project.content?.length > 0 ? (
                <ProjectContent blocks={project.content} title={project.title} />
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
                              href={src}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.galleryLink}
                            >
                              <img
                                src={src}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
