/**
 * Minimal inline SVG icon set for social / contact links.
 * Keeps the bundle tiny and avoids runtime icon dependencies.
 */

const iconPaths = {
  github: (
    <path
      fill="currentColor"
      d="M12 .5C5.73.5.77 5.46.77 11.73c0 4.97 3.23 9.18 7.7 10.67.56.1.76-.24.76-.54v-2.09c-3.14.68-3.8-1.33-3.8-1.33-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.52-2.51-.29-5.15-1.26-5.15-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.17.91-.26 1.89-.39 2.86-.39s1.95.13 2.86.39c2.19-1.48 3.14-1.17 3.14-1.17.63 1.57.23 2.73.12 3.02.73.79 1.17 1.8 1.17 3.04 0 4.36-2.65 5.3-5.17 5.58.41.35.77 1.04.77 2.1v3.11c0 .3.2.65.77.54 4.47-1.49 7.69-5.7 7.69-10.67C23.23 5.46 18.27.5 12 .5z"
    />
  ),
  linkedin: (
    <>
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0z"
      />
    </>
  ),
  mail: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 6h18v12H3z M3 6l9 7 9-7"
    />
  ),
  twitter: (
    <path
      fill="currentColor"
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
    />
  ),
};

export function SocialIcon({ name, size = 20 }) {
  const path = iconPaths[name];
  if (!path) return null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
