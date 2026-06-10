import styles from './Footer.module.css';

export function Footer({ profile }) {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>
          &copy; {year} {profile.name}. Gebaut mit React, Vite und Framer Motion.
        </p>
        <a href="#hero" className={styles.backToTop} aria-label="Zurück nach oben">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 19V5M5 12l7-7 7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Top</span>
        </a>
      </div>
    </footer>
  );
}
