import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AmbientBackground } from './components/AmbientBackground/AmbientBackground.jsx';
import { Hero } from './components/Hero/Hero.jsx';
import { Education } from './components/Education/Education.jsx';
import { ProjectImageSlideshow } from './components/ProjectImageSlideshow/ProjectImageSlideshow.jsx';
import { Timeline } from './components/Timeline/Timeline.jsx';
import { ProjectModal } from './components/ProjectModal/ProjectModal.jsx';
import { Footer } from './components/Footer/Footer.jsx';
import profileDe from './data/profile.json';
import profileEn from './data/profile.en.json';
import educationDe from './data/education.json';
import educationEn from './data/education.en.json';
import rawProjectsDe from './data/projects.json';
import rawProjectsEn from './data/projects.en.json';
import { COPY, DEFAULT_LANGUAGE } from './data/copy.js';

const DATA_BY_LANGUAGE = {
  de: {
    profile: profileDe,
    education: educationDe,
    projects: rawProjectsDe,
  },
  en: {
    profile: profileEn,
    education: educationEn,
    projects: rawProjectsEn,
  },
};

const FILTER_DEFINITIONS = (copy) => [
  { id: 'all', label: copy.filters.all, terms: [] },
  {
    id: 'ai',
    label: 'AI / ML',
    terms: ['machine learning', 'anomaly', 'deep learning', 'tensorflow', 'pytorch', 'yolo', 'resnet', 'lstm', 'transformer', 'time series'],
  },
  {
    id: 'grid',
    label: 'Smart Grid',
    terms: ['smart grid', '§14a', '§9', 'bsi', 'kof', 'cls', 'smgw', 'ethercat', 'iec 61850', 'energy'],
  },
  {
    id: 'security',
    label: 'Security',
    terms: ['security', 'cybersecurity', 'intrusion', 'attack', 'mitm', 'anomaly detection', 'kritis'],
  },
  {
    id: 'vision',
    label: 'Vision / GIS',
    terms: ['computer vision', 'object detection', 'remote sensing', 'gis', 'geopandas', 'satellite', 'yolo'],
  },
  {
    id: 'apps',
    label: 'Apps / Tools',
    terms: ['react', 'fastapi', 'gui', 'pyside', 'java', 'desktop', 'simulation', 'software'],
  },
];

const ABSOLUTE_URL_PATTERN = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i;

function projectHaystack(project) {
  return [
    project.title,
    project.shortDescription,
    project.location,
    ...(project.languages ?? []),
    ...(project.tags ?? []),
  ]
    .join(' ')
    .toLowerCase();
}

function matchesFilter(project, filter) {
  if (filter.id === 'all') return true;
  const haystack = projectHaystack(project);
  return filter.terms.some((term) => haystack.includes(term));
}

function collectProjectImages(projects, copy) {
  const seen = new Set();
  const images = [];

  const addImage = (project, image, fallbackCaption) => {
    const source = typeof image === 'string' ? image : image?.src;
    if (!source || seen.has(source)) return;
    if (
      ABSOLUTE_URL_PATTERN.test(source) ||
      source.startsWith('data:') ||
      source.startsWith('blob:') ||
      source.startsWith('#')
    ) {
      return;
    }

    seen.add(source);
    images.push({
      src: source,
      alt:
        (typeof image === 'string' ? undefined : image.alt) ||
        copy.projectImageFallback(project.title),
      caption:
        (typeof image === 'string' ? undefined : image.caption) ||
        fallbackCaption ||
        project.title,
      projectTitle: project.title,
    });
  };

  for (const project of projects) {
    addImage(project, project.image, project.title);

    for (const block of project.content ?? []) {
      if (block.type === 'image') {
        addImage(project, block, block.alt);
      }

      if (block.type === 'imageRow') {
        for (const image of block.images ?? []) {
          addImage(project, image, image.caption || image.alt);
        }
      }

      if (block.type === 'slideshow') {
        for (const image of block.images ?? []) {
          addImage(project, image, image.caption || image.alt);
        }
      }
    }

    for (const source of project.gallery ?? []) {
      addImage(project, source, project.title);
    }
  }

  return images;
}

export default function App() {
  const timelineRef = useRef(null);
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
    const savedLanguage = window.localStorage.getItem('portfolio-language');
    return savedLanguage && savedLanguage in DATA_BY_LANGUAGE
      ? savedLanguage
      : DEFAULT_LANGUAGE;
  });
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const copy = COPY[language] ?? COPY[DEFAULT_LANGUAGE];
  const { profile, education, projects: rawProjects } =
    DATA_BY_LANGUAGE[language] ?? DATA_BY_LANGUAGE[DEFAULT_LANGUAGE];

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem('portfolio-language', language);
  }, [language]);

  // Always render most recent projects first, independent of JSON order.
  const projects = useMemo(
    () =>
      [...rawProjects].sort((a, b) => (a.month < b.month ? 1 : -1)),
    [rawProjects]
  );
  const projectImages = useMemo(
    () => collectProjectImages(projects, copy),
    [copy, projects]
  );
  const filters = useMemo(
    () =>
      FILTER_DEFINITIONS(copy).map((filter) => ({
        ...filter,
        count: projects.filter((project) => matchesFilter(project, filter))
          .length,
      })),
    [copy, projects]
  );
  const filteredProjects = useMemo(() => {
    const filter = filters.find((item) => item.id === activeFilter) ?? filters[0];
    return projects.filter((project) => matchesFilter(project, filter));
  }, [activeFilter, filters, projects]);
  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  );

  const scrollToTimeline = useCallback(() => {
    timelineRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  const openProject = useCallback((project) => setSelectedProjectId(project.id), []);
  const closeProject = useCallback(() => setSelectedProjectId(null), []);

  return (
    <>
      <AmbientBackground />
      <Hero
        profile={profile}
        language={language}
        copy={copy.hero}
        languageCopy={copy}
        onLanguageChange={setLanguage}
        onScrollToTimeline={scrollToTimeline}
      />
      <Education entries={education} copy={copy.education} />
      <ProjectImageSlideshow images={projectImages} copy={copy.projectImages} />
      <Timeline
        ref={timelineRef}
        projects={filteredProjects}
        language={language}
        copy={copy.timeline}
        filterCopy={copy.filters}
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        totalProjectCount={projects.length}
        onOpenProject={openProject}
      />
      <Footer profile={profile} copy={copy.footer} />
      <ProjectModal
        project={selectedProject}
        copy={copy.modal}
        contentCopy={copy.projectContent}
        onClose={closeProject}
      />
    </>
  );
}
