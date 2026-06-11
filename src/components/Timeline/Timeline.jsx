import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ProjectFilters } from '../ProjectFilters/ProjectFilters.jsx';
import { TimelineItem } from './TimelineItem.jsx';
import { YearIndex } from './YearIndex.jsx';
import styles from './Timeline.module.css';

/**
 * Vertical, alternating project timeline with a scroll-progress line,
 * a fixed year index on the right edge and a click handler that surfaces
 * the "Mehr Info" modal to the parent component.
 */

export const Timeline = forwardRef(function Timeline(
  {
    projects,
    filters = [],
    activeFilter = 'all',
    onFilterChange = () => {},
    totalProjectCount = projects.length,
    onOpenProject,
  },
  forwardedRef
) {
  const wrapperRef = useRef(null);
  const itemRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Scroll progress line (0 -> 1 as the timeline passes through the viewport)
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start center', 'end center'],
  });
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const registerItem = useCallback((index, element) => {
    itemRefs.current[index] = element;
  }, []);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, projects.length);
    setActiveIndex(0);
  }, [projects.length]);

  // IntersectionObserver determines which item is most central in the viewport.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const visibility = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = Number(entry.target.dataset.index);
          visibility.set(index, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let bestIndex = 0;
        let bestRatio = -1;
        for (const [index, ratio] of visibility.entries()) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIndex = index;
          }
        }
        if (bestRatio > 0) {
          setActiveIndex(bestIndex);
        }
      },
      {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    itemRefs.current.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [projects.length]);

  const handleProjectClick = useCallback((index) => {
    const target = itemRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return (
    <section
      className={styles.timeline}
      id="timeline"
      ref={(node) => {
        wrapperRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }}
    >
      <div className={styles.header}>
        <p className={styles.eyebrow}>Timeline</p>
        <h2 className={styles.heading}>Karriere &amp; Projekte</h2>
        <p className={styles.subheading}>
          Ein chronologischer Überblick über Stationen, die mich am meisten geprägt haben.
        </p>
        <ProjectFilters
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
          totalCount={totalProjectCount}
          visibleCount={projects.length}
        />
      </div>

      <div className={styles.track}>
        <div className={styles.trackLine} aria-hidden="true" />
        <motion.div
          className={styles.trackProgress}
          style={{ scaleY: progressScale }}
          aria-hidden="true"
        />

        <ol className={styles.items}>
          {projects.map((project, index) => (
            <TimelineItem
              key={project.id}
              index={index}
              project={project}
              side={index % 2 === 0 ? 'left' : 'right'}
              isActive={index === activeIndex}
              onOpen={() => onOpenProject(project)}
              registerRef={registerItem}
            />
          ))}
        </ol>
      </div>

      <YearIndex
        projects={projects}
        activeIndex={activeIndex}
        onProjectClick={handleProjectClick}
      />
    </section>
  );
});
