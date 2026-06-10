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
});
