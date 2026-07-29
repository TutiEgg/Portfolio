export const COPY = {
  de: {
    languageName: 'Deutsch',
    languageToggleLabel: 'Sprache wechseln',
    languageOptions: {
      de: 'Deutsch',
      en: 'English',
    },
    filters: {
      all: 'Alle',
      ariaLabel: 'Projektfilter',
      summary: (visible, total) => `${visible} / ${total} Case Studies`,
    },
    hero: {
      portraitAlt: (name) => `Portrait von ${name}`,
      focusAreas: [
        'Machine Learning',
        'Smart Grid',
        'Cybersecurity',
        'Computer Vision',
      ],
      signalCode: 'live-stack',
      signalMetrics: [
        { label: 'Model work', value: 'ML systems' },
        { label: 'Focus', value: 'Research -> product' },
        { label: 'Stack', value: 'Python · React' },
      ],
      cta: 'Projekte ansehen',
      scrollHint: 'scroll',
    },
    education: {
      eyebrow: 'Education',
      heading: 'Ausbildung',
      subheading: 'Akademischer Hintergrund und Studienschwerpunkte.',
      highlightsLabel: 'Schwerpunkte',
    },
    projectImages: {
      eyebrow: 'Projektbilder',
      heading: 'Einblicke aus allen Projekten',
      previous: 'Vorheriges Projektbild',
      next: 'Nächstes Projektbild',
    },
    timeline: {
      eyebrow: 'Timeline',
      heading: 'Karriere & Projekte',
      subheading:
        'Ein chronologischer Überblick über Stationen, die mich am meisten geprägt haben.',
      statsLabel: 'Projekt-Kennzahlen',
      moreInfo: 'Mehr Info',
      navigationLabel: 'Timeline-Navigation',
      scrollToProject: (title, month, year) =>
        `Zu ${title} (${month} ${year}) scrollen`,
    },
    modal: {
      close: 'Schließen',
      sectionNav: 'Projektabschnitte',
      galleryTitle: 'Abbildungen & Formeln',
      figureAlt: (title, index) => `${title} — Abbildung ${index}`,
      lightbox: 'Bildansicht',
      lightboxClose: 'Bildansicht schließen',
    },
    projectContent: {
      openImage: (alt) => `Bild öffnen: ${alt}`,
      figureAlt: (title, index) => `${title} — Abbildung ${index}`,
      slideshowGallery: (title) => `${title} Bildergalerie`,
      slideshowImage: (title, index) => `${title} — Slideshow-Bild ${index}`,
      previousImage: 'Vorheriges Bild',
      nextImage: 'Nächstes Bild',
      showImage: (index) => `Bild ${index} anzeigen`,
    },
    footer: {
      kicker: 'Kontakt',
      copy: (year, name) =>
        `© ${year} ${name}. Gebaut mit React, Vite und Framer Motion.`,
      backToTop: 'Zurück nach oben',
      top: 'Top',
    },
    projectImageFallback: (title) => `${title} — Projektbild`,
  },
  en: {
    languageName: 'English',
    languageToggleLabel: 'Change language',
    languageOptions: {
      de: 'Deutsch',
      en: 'English',
    },
    filters: {
      all: 'All',
      ariaLabel: 'Project filters',
      summary: (visible, total) => `${visible} / ${total} case studies`,
    },
    hero: {
      portraitAlt: (name) => `Portrait of ${name}`,
      focusAreas: [
        'Machine Learning',
        'Smart Grid',
        'Cybersecurity',
        'Computer Vision',
      ],
      signalCode: 'live-stack',
      signalMetrics: [
        { label: 'Model work', value: 'ML systems' },
        { label: 'Focus', value: 'Research -> product' },
        { label: 'Stack', value: 'Python · React' },
      ],
      cta: 'View projects',
      scrollHint: 'scroll',
    },
    education: {
      eyebrow: 'Education',
      heading: 'Education',
      subheading: 'Academic background and study focus areas.',
      highlightsLabel: 'Focus areas',
    },
    projectImages: {
      eyebrow: 'Project images',
      heading: 'Snapshots from all projects',
      previous: 'Previous project image',
      next: 'Next project image',
    },
    timeline: {
      eyebrow: 'Timeline',
      heading: 'Career & Projects',
      subheading:
        'A chronological overview of the milestones and projects that shaped my work.',
      statsLabel: 'Project metrics',
      moreInfo: 'More info',
      navigationLabel: 'Timeline navigation',
      scrollToProject: (title, month, year) =>
        `Scroll to ${title} (${month} ${year})`,
    },
    modal: {
      close: 'Close',
      sectionNav: 'Project sections',
      galleryTitle: 'Figures & formulas',
      figureAlt: (title, index) => `${title} — figure ${index}`,
      lightbox: 'Image view',
      lightboxClose: 'Close image view',
    },
    projectContent: {
      openImage: (alt) => `Open image: ${alt}`,
      figureAlt: (title, index) => `${title} — figure ${index}`,
      slideshowGallery: (title) => `${title} image gallery`,
      slideshowImage: (title, index) => `${title} — slideshow image ${index}`,
      previousImage: 'Previous image',
      nextImage: 'Next image',
      showImage: (index) => `Show image ${index}`,
    },
    footer: {
      kicker: 'Contact',
      copy: (year, name) =>
        `© ${year} ${name}. Built with React, Vite and Framer Motion.`,
      backToTop: 'Back to top',
      top: 'Top',
    },
    projectImageFallback: (title) => `${title} — project image`,
  },
};

export const DEFAULT_LANGUAGE = 'de';
