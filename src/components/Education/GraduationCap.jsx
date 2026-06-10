import { motion } from 'framer-motion';
import styles from './Education.module.css';

/**
 * Animated graduation cap mark used as the visual anchor of the Education section.
 * The tassel swings on hover via a parent variant (see Education.jsx).
 */
export function GraduationCap() {
  return (
    <motion.svg
      viewBox="0 0 220 220"
      className={styles.capSvg}
      role="img"
      aria-label="Bachelor-Hut"
    >
      <defs>
        <linearGradient id="capFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a2050" />
          <stop offset="100%" stopColor="#15112f" />
        </linearGradient>
        <linearGradient id="capEdge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#f0abfc" />
        </linearGradient>
        <linearGradient id="tasselGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <radialGradient id="capGlow" cx="0.5" cy="0.5" r="0.55">
          <stop offset="0%" stopColor="#8b7cf6" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8b7cf6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient glow */}
      <circle cx="110" cy="110" r="100" fill="url(#capGlow)" />

      {/* Cap base (mortar board) */}
      <g>
        {/* Band under the board */}
        <path
          d="M55 128 Q55 148 78 158 Q95 164 110 164 Q125 164 142 158 Q165 148 165 128 L165 116 Q165 116 110 116 Q55 116 55 116 Z"
          fill="url(#capFill)"
          stroke="url(#capEdge)"
          strokeWidth="1.5"
        />
        {/* Flat top */}
        <polygon
          points="110,72 190,110 110,148 30,110"
          fill="url(#capFill)"
          stroke="url(#capEdge)"
          strokeWidth="1.8"
        />
        {/* Subtle highlight on top edge */}
        <polyline
          points="30,110 110,72 190,110"
          fill="none"
          stroke="#c4b5fd"
          strokeOpacity="0.45"
          strokeWidth="1"
        />
        {/* Button on the center of the board */}
        <circle cx="110" cy="110" r="4" fill="#fbbf24" />
      </g>

      {/* Tassel: pivots from the center button (110, 110) in SVG user-space */}
      <motion.g
        style={{ transformOrigin: '110px 110px', transformBox: 'view-box' }}
        variants={{
          rest: { rotate: 0 },
          hover: {
            rotate: [0, -12, 9, -5, 3, 0],
            transition: {
              duration: 1.6,
              ease: [0.2, 0.8, 0.2, 1],
              times: [0, 0.2, 0.45, 0.7, 0.88, 1],
            },
          },
        }}
      >
        <path
          d="M110 110 Q150 128 168 162"
          stroke="url(#tasselGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="168" cy="162" r="4" fill="#fbbf24" />
        <path
          d="M168 162 L162 184 M168 162 L168 188 M168 162 L174 184"
          stroke="url(#tasselGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </motion.g>
    </motion.svg>
  );
}
