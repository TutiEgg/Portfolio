import { motion } from 'framer-motion';
import { COPY, DEFAULT_LANGUAGE } from '../../data/copy.js';
import { assetPath } from '../../utils/assetPath.js';
import { SocialIcon } from '../icons/SocialIcon.jsx';
import styles from './Hero.module.css';

/**
 * Landing hero section: profile photo, bio, contact info and a CTA
 * that smooth-scrolls down to the timeline section.
 */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] },
  },
};

const signalBars = [34, 56, 42, 78, 64, 88, 52, 70, 46, 82, 60, 74];

export function Hero({
  profile,
  language = DEFAULT_LANGUAGE,
  copy = COPY.de.hero,
  languageCopy = COPY.de,
  onLanguageChange = () => {},
  onScrollToTimeline,
}) {
  const {
    name,
    role,
    tagline,
    bio,
    photo,
    email,
    location,
    socials = [],
  } = profile;
  const languageOptions = languageCopy.languageOptions ?? COPY.de.languageOptions;

  return (
    <header className={styles.hero} id="hero">
      <div className={styles.languageToggle} aria-label={languageCopy.languageToggleLabel}>
        {Object.entries(languageOptions).map(([code, label]) => (
          <button
            key={code}
            type="button"
            className={language === code ? styles.languageActive : ''}
            onClick={() => onLanguageChange(code)}
            aria-pressed={language === code}
          >
            {label}
          </button>
        ))}
      </div>

      <motion.div
        className={styles.inner}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className={styles.photoWrapper}
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        >
          <div className={styles.photoGlow} aria-hidden="true" />
          <img
            src={assetPath(photo)}
            alt={copy.portraitAlt(name)}
            className={styles.photo}
          />
        </motion.div>

        <div className={styles.content}>
          <motion.p className={styles.role} variants={itemVariants}>
            {role}
          </motion.p>
          <motion.h1 className={styles.name} variants={itemVariants}>
            {name}
          </motion.h1>
          <motion.p className={styles.tagline} variants={itemVariants}>
            {tagline}
          </motion.p>
          <motion.p className={styles.bio} variants={itemVariants}>
            {bio}
          </motion.p>

          <motion.ul className={styles.focusPills} variants={itemVariants}>
            {copy.focusAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </motion.ul>

          <motion.div className={styles.meta} variants={itemVariants}>
            {location && (
              <span className={styles.metaItem}>
                <span className={styles.metaDot} aria-hidden="true" />
                {location}
              </span>
            )}
            {email && (
              <a href={`mailto:${email}`} className={styles.metaItem}>
                <span className={styles.metaDot} aria-hidden="true" />
                {email}
              </a>
            )}
          </motion.div>

          <motion.div className={styles.signalPanel} variants={itemVariants}>
            <div className={styles.signalHeader}>
              <span className={styles.signalCode}>{copy.signalCode}</span>
            </div>
            <div className={styles.signalBars} aria-hidden="true">
              {signalBars.map((height, index) => (
                <span
                  key={index}
                  style={{
                    height: `${height}%`,
                    animationDelay: `${index * 90}ms`,
                  }}
                />
              ))}
            </div>
            <dl className={styles.signalMetrics}>
              {copy.signalMetrics.map((metric) => (
                <div key={metric.label}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div className={styles.actions} variants={itemVariants}>
            <motion.button
              type="button"
              className={styles.ctaPrimary}
              onClick={onScrollToTimeline}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {copy.cta}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 5v14M5 12l7 7 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>

            <ul className={styles.socials}>
              {socials.map((social) => (
                <li key={social.label}>
                  <motion.a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label={social.label}
                    whileHover={{ y: -3, scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SocialIcon name={social.icon} />
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className={styles.scrollHint}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        aria-hidden="true"
      >
        <span>{copy.scrollHint}</span>
        <motion.div
          className={styles.scrollHintLine}
          animate={{ scaleY: [0.2, 1, 0.2], originY: 0 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </header>
  );
}
