import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectModal } from '../src/components/ProjectModal/ProjectModal.jsx';

const project = {
  id: 'p1',
  title: 'Test Project',
  month: '2024-03',
  exactDate: '15. März 2024',
  location: 'Berlin, DE',
  image: '/images/project1.svg',
  shortDescription: 'Short.',
  fullDescription: 'Paragraph one.\n\nParagraph two.',
  tags: ['Python', 'MLOps'],
  links: [{ label: 'GitHub', url: 'https://github.com/example' }],
};

const slideshowProject = {
  ...project,
  fullDescription: undefined,
  links: [],
  content: [
    { type: 'heading', level: 2, text: 'Worum geht es?' },
    {
      type: 'slideshow',
      title: 'Final Review',
      images: [
        {
          src: '/images/rilkosan/final-review/presentation.jpeg',
          alt: 'Demo shot 1',
          caption: 'Presentation caption',
        },
        {
          src: '/images/rilkosan/final-review/demonstrator-detail.jpeg',
          alt: 'Demo shot 2',
          caption: 'Detail caption',
        },
      ],
    },
  ],
};

describe('ProjectModal', () => {
  it('renders title, tags and full description paragraphs when a project is provided', () => {
    render(<ProjectModal project={project} onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toHaveAccessibleName('Test Project');
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Paragraph one.')).toBeInTheDocument();
    expect(screen.getByText('Paragraph two.')).toBeInTheDocument();
  });

  it('renders nothing when no project is provided', () => {
    const { queryByRole } = render(<ProjectModal project={null} onClose={() => {}} />);
    expect(queryByRole('dialog')).toBeNull();
  });

  it('closes when the ESC key is pressed', () => {
    const onClose = vi.fn();
    render(<ProjectModal project={project} onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when the backdrop is clicked but not when the dialog is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ProjectModal project={project} onClose={onClose} />);

    await user.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();

    await user.click(screen.getByTestId('modal-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when the explicit close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ProjectModal project={project} onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: /schließen/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders slideshow content blocks and opens their images in the lightbox', async () => {
    const user = userEvent.setup();
    render(<ProjectModal project={slideshowProject} onClose={() => {}} />);

    expect(screen.getByText('Final Review')).toBeInTheDocument();
    expect(screen.getByText('Presentation caption')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /chstes bild/i }));
    expect(screen.getByText('Detail caption')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /demo shot 2/i }));
    expect(screen.getByRole('dialog', { name: /bildansicht/i })).toBeInTheDocument();
  });
});
