import { useCallback, useMemo, useRef, useState } from 'react';
import { AmbientBackground } from './components/AmbientBackground/AmbientBackground.jsx';
import { Hero } from './components/Hero/Hero.jsx';
import { Education } from './components/Education/Education.jsx';
import { Timeline } from './components/Timeline/Timeline.jsx';
import { ProjectModal } from './components/ProjectModal/ProjectModal.jsx';
import { Footer } from './components/Footer/Footer.jsx';
import profile from './data/profile.json';
import education from './data/education.json';
import rawProjects from './data/projects.json';

const FILTER_DEFINITIONS = [
  { id: 'all', label: 'Alle', terms: [] },
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

export default function App() {
  const timelineRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Always render most recent projects first, independent of JSON order.
  const projects = useMemo(
    () =>
      [...rawProjects].sort((a, b) => (a.month < b.month ? 1 : -1)),
    []
  );
  const filters = useMemo(
    () =>
      FILTER_DEFINITIONS.map((filter) => ({
        ...filter,
        count: projects.filter((project) => matchesFilter(project, filter))
          .length,
      })),
    [projects]
  );
  const filteredProjects = useMemo(() => {
    const filter = filters.find((item) => item.id === activeFilter) ?? filters[0];
    return projects.filter((project) => matchesFilter(project, filter));
  }, [activeFilter, filters, projects]);

  const scrollToTimeline = useCallback(() => {
    timelineRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  const openProject = useCallback((project) => setSelectedProject(project), []);
  const closeProject = useCallback(() => setSelectedProject(null), []);

  return (
    <>
      <AmbientBackground />
      <Hero profile={profile} onScrollToTimeline={scrollToTimeline} />
      <Education entries={education} />
      <Timeline
        ref={timelineRef}
        projects={filteredProjects}
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        totalProjectCount={projects.length}
        onOpenProject={openProject}
      />
      <Footer profile={profile} />
      <ProjectModal project={selectedProject} onClose={closeProject} />
    </>
  );
}
