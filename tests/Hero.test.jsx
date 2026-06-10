import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Hero } from '../src/components/Hero/Hero.jsx';

const profile = {
  name: 'Jane Doe',
  role: 'ML Engineer',
  tagline: 'Short tagline',
  bio: 'Longer bio text that describes the person in detail.',
  photo: '/images/profile.svg',
  email: 'jane@example.com',
  location: 'Berlin',
  socials: [{ label: 'GitHub', url: 'https://github.com/jane', icon: 'github' }],
};

describe('Hero', () => {
  it('renders name, role and contact information from the profile data', () => {
    render(<Hero profile={profile} onScrollToTimeline={() => {}} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Jane Doe');
    expect(screen.getByText('ML Engineer')).toBeInTheDocument();
    expect(screen.getByText('Berlin')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('fires the scroll callback when the CTA is clicked', async () => {
    const user = userEvent.setup();
    const onScroll = vi.fn();
    render(<Hero profile={profile} onScrollToTimeline={onScroll} />);
    await user.click(screen.getByRole('button', { name: /projekte ansehen/i }));
    expect(onScroll).toHaveBeenCalledTimes(1);
  });

  it('renders a link for each social entry', () => {
    render(<Hero profile={profile} onScrollToTimeline={() => {}} />);
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/jane'
    );
  });
});
