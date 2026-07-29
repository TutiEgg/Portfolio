import { SocialIcon } from '../icons/SocialIcon.jsx';
import { COPY } from '../../data/copy.js';
import styles from './Footer.module.css';

export function Footer({ profile, copy = COPY.de.footer }) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.contact}>
          <p className={styles.kicker}>{copy.kicker}</p>
          <p className={styles.copy}>
            {copy.copy(year, profile.name)}
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

        <a href="#hero" className={styles.backToTop} aria-label={copy.backToTop}>
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
          <span>{copy.top}</span>
        </a>
      </div>
    </footer>
  );
}
