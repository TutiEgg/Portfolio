import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { YearIndex } from '../src/components/Timeline/YearIndex.jsx';

const projects = [
  { id: 'a', title: 'Projekt A', month: '2024-09' },
  { id: 'b', title: 'Projekt B', month: '2024-02' },
  { id: 'c', title: 'Projekt C', month: '2023-06' },
];

describe('YearIndex', () => {
  it('renders one stop per project (year + month)', () => {
    render(
      <YearIndex projects={projects} activeIndex={0} onProjectClick={() => {}} />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    expect(screen.getByText('Sep')).toBeInTheDocument();
    expect(screen.getByText('Feb')).toBeInTheDocument();
    expect(screen.getByText('Jun')).toBeInTheDocument();
  });

  it('marks the active project with aria-current="true"', () => {
    render(
      <YearIndex projects={projects} activeIndex={1} onProjectClick={() => {}} />
    );
    const active = screen.getByRole('button', { name: /zu projekt b/i });
    expect(active).toHaveAttribute('aria-current', 'true');
    const inactive = screen.getByRole('button', { name: /zu projekt a/i });
    expect(inactive).not.toHaveAttribute('aria-current');
  });

  it('calls the click handler with the selected project index', async () => {
    const user = userEvent.setup();
    const onProjectClick = vi.fn();
    render(
      <YearIndex projects={projects} activeIndex={0} onProjectClick={onProjectClick} />
    );
    await user.click(screen.getByRole('button', { name: /zu projekt c/i }));
    expect(onProjectClick).toHaveBeenCalledWith(2);
  });

  it('renders nothing when no projects are provided', () => {
    const { container } = render(
      <YearIndex projects={[]} activeIndex={0} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
