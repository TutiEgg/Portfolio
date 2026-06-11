import styles from './ProjectFilters.module.css';

export function ProjectFilters({
  filters,
  activeFilter,
  onFilterChange,
  totalCount,
  visibleCount,
}) {
  if (!filters?.length) return null;

  return (
    <div className={styles.filters} aria-label="Projektfilter">
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
        {visibleCount} / {totalCount} Case Studies
      </p>
    </div>
  );
}
