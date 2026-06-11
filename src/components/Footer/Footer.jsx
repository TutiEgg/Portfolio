import { SocialIcon } from '../icons/SocialIcon.jsx';
import styles from './Footer.module.css';

export function Footer({ profile }) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.contact}>
          <p className={styles.kicker}>Kontakt</p>
          <h2 className={styles.heading}>Applied AI, Security & Smart-Grid Systeme</h2>
          <p className={styles.copy}>
            &copy; {year} {profile.name}. Gebaut mit React, Vite und Framer Motion.
          </p>
          <ul className={styles.socials}>
            {(profile.socials ?? []).map((social) => (
              <li key={social.label}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <SocialIcon name={social.icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>

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
