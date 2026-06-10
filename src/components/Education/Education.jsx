import { motion } from 'framer-motion';
import { GraduationCap } from './GraduationCap.jsx';
import styles from './Education.module.css';

/**
 * Standalone "Education" section placed between the hero and the project timeline.
 * Renders one card per academic entry with an animated graduation cap, hover
 * lift and glow, and a pill list of study highlights.
 */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.2, 0.8, 0.2, 1] },
  },
};

export function Education({ entries }) {
  if (!entries?.length) return null;

  return (
    <section className={styles.section} id="education" aria-labelledby="education-heading">
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <p className={styles.eyebrow}>Education</p>
        <h2 id="education-heading" className={styles.heading}>
          Ausbildung
        </h2>
        <p className={styles.subheading}>
          Akademischer Hintergrund und Studienschwerpunkte.
        </p>
      </motion.div>

      <motion.ul
        className={styles.list}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {entries.map((entry) => (
          <motion.li key={entry.id} className={styles.item} variants={itemVariants}>
            <motion.article
              className={styles.card}
              initial="rest"
              whileHover="hover"
              whileFocus="hover"
              animate="rest"
              whileTap={{ scale: 0.995 }}
              tabIndex={0}
            >
              <motion.div
                className={styles.shine}
                variants={{
                  rest: { x: '-120%', opacity: 0 },
                  hover: { x: '140%', opacity: 1 },
                }}
                transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                aria-hidden="true"
              />

              <motion.div
                className={styles.sparkles}
                aria-hidden="true"
                variants={{
                  rest: { opacity: 0 },
                  hover: { opacity: 1, transition: { staggerChildren: 0.08 } },
                }}
              >
                {[
                  { top: '12%', left: '8%', size: 6, delay: 0 },
                  { top: '24%', left: '80%', size: 4, delay: 0.1 },
                  { top: '70%', left: '12%', size: 5, delay: 0.2 },
                  { top: '78%', left: '72%', size: 4, delay: 0.3 },
                  { top: '40%', left: '90%', size: 3, delay: 0.4 },
                ].map((s, i) => (
                  <motion.span
                    key={i}
                    className={styles.sparkle}
                    style={{
                      top: s.top,
                      left: s.left,
                      width: s.size,
                      height: s.size,
                    }}
                    variants={{
                      rest: { scale: 0, opacity: 0 },
                      hover: {
                        scale: [0, 1.2, 0.8, 1],
                        opacity: [0, 1, 0.7, 1],
                        transition: {
                          duration: 1.2,
                          delay: s.delay,
                          repeat: Infinity,
                          repeatType: 'reverse',
                          ease: 'easeInOut',
                        },
                      },
                    }}
                  />
                ))}
              </motion.div>

              <motion.div
                className={styles.capWrap}
                variants={{
                  rest: { y: 0, rotate: 0, scale: 1 },
                  hover: { y: -8, rotate: -4, scale: 1.04 },
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              >
                <motion.div
                  className={styles.capGlow}
                  aria-hidden="true"
                  variants={{
                    rest: { opacity: 0.35, scale: 1 },
                    hover: { opacity: 0.85, scale: 1.15 },
                  }}
                  transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                />
                <GraduationCap />
              </motion.div>

              <div className={styles.body}>
                <div className={styles.meta}>
                  <span className={styles.period}>{entry.period}</span>
                  {entry.location && (
                    <>
                      <span className={styles.metaDot} aria-hidden="true">
                        ·
                      </span>
                      <span className={styles.location}>{entry.location}</span>
                    </>
                  )}
                </div>

                <h3 className={styles.degree}>
                  {entry.degree}
                  <span className={styles.subject}> — {entry.subject}</span>
                </h3>

                <p className={styles.institution}>{entry.institution}</p>
                <p className={styles.summary}>{entry.summary}</p>

                {entry.highlights?.length > 0 && (
                  <ul className={styles.highlights} aria-label="Schwerpunkte">
                    {entry.highlights.map((h) => (
                      <li key={h} className={styles.highlight}>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}

                {entry.link?.url && (
                  <motion.a
                    href={entry.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {entry.link.label}
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
                  </motion.a>
                )}
              </div>
            </motion.article>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
