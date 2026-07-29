import { motion } from 'framer-motion';
import { COPY, DEFAULT_LANGUAGE } from '../../data/copy.js';
import { parseMonth } from '../../utils/formatMonth.js';
import styles from './YearIndex.module.css';

/**
 * Fixed vertical timeline navigator on the right edge (desktop only).
 * Shows one stop per project with year + short month label. The current
 * project is highlighted with a sliding indicator and an accent line.
 */

export function YearIndex({
  projects = [],
  activeIndex = 0,
  language = DEFAULT_LANGUAGE,
  copy = COPY.de.timeline,
  onProjectClick,
}) {
  if (!projects.length) return null;

  return (
    <nav className={styles.yearIndex} aria-label={copy.navigationLabel}>
      <ol className={styles.list}>
        {projects.map((project, index) => {
          const [year, monthShort] = parseMonth(project.month, language);
          const isActive = index === activeIndex;
          const prevYear =
            index > 0 ? parseMonth(projects[index - 1].month, language)[0] : null;
          const showYear = year !== prevYear;

          return (
            <li key={project.id} className={styles.item}>
              <button
                type="button"
                onClick={() => onProjectClick?.(index)}
                className={`${styles.button} ${isActive ? styles.isActive : ''}`}
                aria-current={isActive ? 'true' : undefined}
                aria-label={copy.scrollToProject(project.title, monthShort, year)}
              >
                <span className={styles.dot} aria-hidden="true">
                  {isActive && (
                    <motion.span
                      layoutId="activeTimelineIndicator"
                      className={styles.activeDot}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </span>

                <span className={styles.label}>
                  {showYear ? (
                    <span className={styles.year}>{year}</span>
                  ) : (
                    <span className={styles.yearPlaceholder} aria-hidden="true">
                      {year}
                    </span>
                  )}
                  <span className={styles.month}>{monthShort}</span>
                </span>

                {isActive && (
                  <motion.span
                    layoutId="activeTimelineLine"
                    className={styles.activeLine}
                    aria-hidden="true"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
