import styles from './TechStackTags.module.css';

/**
 * Tech-Stack als einheitliche Pills (wie zuvor). Einträge in `languages`
 * (z. B. Java) erhalten eine dezente Zusatz-Hervorhebung (Rand/Glow).
 */

export function TechStackTags({ languages = [], tags = [], className = '' }) {
  const hasLang = languages.length > 0;
  const hasTags = tags.length > 0;
  if (!hasLang && !hasTags) return null;

  return (
    <ul className={`${styles.list} ${className}`.trim()} aria-label="Tech-Stack">
      {languages.map((lang) => (
        <li
          key={`lang-${lang}`}
          className={`${styles.tag} ${styles.tagHighlight}`}
        >
          {lang}
        </li>
      ))}
      {tags.map((tag) => (
        <li key={tag} className={styles.tag}>
          {tag}
        </li>
      ))}
    </ul>
  );
}
