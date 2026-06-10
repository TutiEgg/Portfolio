import { useCallback, useMemo, useRef, useState } from 'react';
import { Hero } from './components/Hero/Hero.jsx';
import { Education } from './components/Education/Education.jsx';
import { Timeline } from './components/Timeline/Timeline.jsx';
import { ProjectModal } from './components/ProjectModal/ProjectModal.jsx';
import { Footer } from './components/Footer/Footer.jsx';
import profile from './data/profile.json';
import education from './data/education.json';
import rawProjects from './data/projects.json';

export default function App() {
  const timelineRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // Always render most recent projects first, independent of JSON order.
  const projects = useMemo(
    () =>
      [...rawProjects].sort((a, b) => (a.month < b.month ? 1 : -1)),
    []
  );

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
      <Hero profile={profile} onScrollToTimeline={scrollToTimeline} />
      <Education entries={education} />
      <Timeline
        ref={timelineRef}
        projects={projects}
        onOpenProject={openProject}
      />
      <Footer profile={profile} />
      <ProjectModal project={selectedProject} onClose={closeProject} />
    </>
  );
}
