import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimelineItem } from '../src/components/Timeline/TimelineItem.jsx';

const project = {
  id: 'p1',
  title: 'Test Project',
  month: '2024-03',
  exactDate: '15. März 2024',
  location: 'Berlin, DE',
  image: '/images/project1.svg',
  shortDescription: 'Short desc.',
  fullDescription: 'Full desc.',
  tags: ['Python'],
  links: [],
};

function renderItem(overrides = {}) {
  return render(
    <ol>
      <TimelineItem
        index={0}
        project={project}
        side="left"
        isActive={false}
        onOpen={() => {}}
        registerRef={() => {}}
        {...overrides}
      />
    </ol>
  );
}

describe('TimelineItem', () => {
  it('renders the year and month abbreviation derived from the month field', () => {
    renderItem();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('Mär')).toBeInTheDocument();
  });

  it('calls the open callback when the "Mehr Info" button is clicked', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    renderItem({ onOpen });
    await user.click(screen.getByRole('button', { name: /mehr info/i }));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('registers its DOM node via the registerRef callback', () => {
    const registerRef = vi.fn();
    renderItem({ registerRef });
    expect(registerRef).toHaveBeenCalled();
    const [index, element] = registerRef.mock.calls[0];
    expect(index).toBe(0);
    expect(element).toBeInstanceOf(HTMLElement);
  });
});
