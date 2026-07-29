import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { COPY, DEFAULT_LANGUAGE } from '../../data/copy.js';
import { assetPath } from '../../utils/assetPath.js';
import { parseMonth } from '../../utils/formatMonth.js';
import { TechStackTags } from '../TechStackTags/TechStackTags.jsx';
import styles from './TimelineItem.module.css';

/**
 * Single entry in the project timeline.
 * Has two visual states (collapsed / expanded) driven by its `useInView` hook
 * plus a blurred project-image backdrop that fades in as the user scrolls by.
 */

const cardVariants = {
  hidden: (side) => ({ opacity: 0, x: side === 'left' ? -40 : 40 }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] },
  },
};

const dateVariants = {
  hidden: (side) => ({ opacity: 0, x: side === 'left' ? 20 : -20 }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] },
  },
};

const CASE_STATS = {
  'silgentas-2026': ['SAC · 0 kWh ENS', '§14a / BSI', 'CNN-BiLSTM'],
  'rilkosan-2026': ['100k Frames', '4 Layers', 'EtherCAT IDS'],
  'project-charta-2025': ['YOLOv8', 'GIS Pipeline', 'Risk Scoring'],
  'flugsim-geodesic-2024': ['3D Math', 'Geodesics', 'Java'],
  'weather-forecasting-2024': ['LSTM', 'Transformer', 'SARIMA'],
  'signal-processing-gui-2023': ['PySide2', 'Bokeh', 'Signal Tools'],
};

function getCaseStats(project) {
  return (
    CASE_STATS[project.id] ?? [
      project.languages?.[0],
      project.tags?.[0],
      project.tags?.[1],
    ]
  ).filter(Boolean);
}

export function TimelineItem({
  index,
  project,
  language = DEFAULT_LANGUAGE,
  copy = COPY.de.timeline,
  side,
  isActive,
  onOpen,
  registerRef,
}) {
  const liRef = useRef(null);
  const inView = useInView(liRef, {
    once: false,
    amount: 0.4,
    margin: '0px 0px -10% 0px',
  });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (inView) setExpanded(true);
  }, [inView]);

  useEffect(() => {
    if (liRef.current && typeof registerRef === 'function') {
      registerRef(index, liRef.current);
    }
  }, [index, registerRef]);

  const [year, monthShort] = parseMonth(project.month, language);
  const projectImage = assetPath(project.image);
  const caseStats = getCaseStats(project);

  return (
    <motion.li
      ref={liRef}
      data-index={index}
      className={`${styles.item} ${styles[`side-${side}`]} ${
        isActive ? styles.isActive : ''
      }`}
      layout
    >
      {/* Blurred full-bleed project image backdrop */}
      <motion.div
        className={styles.backdrop}
        style={{ backgroundImage: `url(${projectImage})` }}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: expanded ? 0.35 : 0 }}
        transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
      />
      <div className={styles.backdropOverlay} aria-hidden="true" />

      {/* Central dot with pulse animation */}
      <motion.span
        className={styles.dot}
        aria-hidden="true"
        animate={
          isActive
            ? { scale: [1, 1.4, 1], boxShadow: ['0 0 0 0 var(--color-accent-glow)', '0 0 0 14px transparent', '0 0 0 0 var(--color-accent-glow)'] }
            : { scale: 1 }
        }
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Date block */}
      <motion.div
        className={styles.dateBlock}
        variants={dateVariants}
        custom={side}
        initial="hidden"
        animate={expanded ? 'visible' : 'hidden'}
      >
        <span className={styles.dateYear}>{year}</span>
        <span className={styles.dateMonth}>{monthShort}</span>
        <motion.div
          className={styles.dateDetails}
          initial={false}
          animate={{
            opacity: expanded ? 1 : 0,
            y: expanded ? 0 : 8,
          }}
          transition={{ duration: 0.45, delay: expanded ? 0.15 : 0 }}
        >
          <p className={styles.dateTitle}>{project.title}</p>
          <p className={styles.dateExact}>{project.exactDate}</p>
          {project.location && (
            <p className={styles.dateLocation}>{project.location}</p>
          )}
        </motion.div>
      </motion.div>

      {/* Card block (image + description) */}
      <motion.article
        className={styles.card}
        variants={cardVariants}
        custom={side}
        initial="hidden"
        animate={expanded ? 'visible' : 'hidden'}
        whileHover={{
          y: -8,
          rotateX: 1.2,
          rotateY: side === 'left' ? -1.4 : 1.4,
        }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
      >
        <motion.div
          className={styles.imageWrapper}
          layout
          animate={{ aspectRatio: expanded ? '16 / 9' : '4 / 3' }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <img
            src={projectImage}
            alt={project.title}
            className={styles.image}
            loading="lazy"
          />
          <div className={styles.imageGlow} aria-hidden="true" />
        </motion.div>

        {caseStats.length > 0 && (
          <ul className={styles.caseStats} aria-label={copy.statsLabel}>
            {caseStats.slice(0, 3).map((stat) => (
              <li key={stat}>{stat}</li>
            ))}
          </ul>
        )}

        <motion.div
          className={styles.body}
          initial={false}
          animate={{
            opacity: expanded ? 1 : 0,
            height: expanded ? 'auto' : 0,
          }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <p className={styles.description}>{project.shortDescription}</p>

          <TechStackTags
            languages={project.languages}
            tags={project.tags}
          />

          <motion.button
            type="button"
            className={styles.moreButton}
            onClick={onOpen}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {copy.moreInfo}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 12h14M13 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </motion.div>
      </motion.article>
    </motion.li>
  );
}
