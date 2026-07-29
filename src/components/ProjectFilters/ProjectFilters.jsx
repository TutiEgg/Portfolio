import styles from './ProjectFilters.module.css';
import { COPY } from '../../data/copy.js';

export function ProjectFilters({
  filters,
  activeFilter,
  onFilterChange,
  totalCount,
  visibleCount,
  copy = COPY.de.filters,
}) {
  if (!filters?.length) return null;

  return (
    <div className={styles.filters} aria-label={copy.ariaLabel}>
      <div className={styles.filterRail}>
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`${styles.filterButton} ${
              activeFilter === filter.id ? styles.isActive : ''
            }`.trim()}
            onClick={() => onFilterChange(filter.id)}
            aria-pressed={activeFilter === filter.id}
          >
            <span className={styles.filterMark} aria-hidden="true" />
            <span>{filter.label}</span>
            <strong>{filter.count}</strong>
          </button>
        ))}
      </div>
      <p className={styles.summary}>
        {copy.summary(visibleCount, totalCount)}
      </p>
    </div>
  );
}
