import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectImageSlideshow } from '../src/components/ProjectImageSlideshow/ProjectImageSlideshow.jsx';

const images = [
  {
    src: '/images/project-a.png',
    alt: 'Project A screenshot',
    caption: 'First caption',
    projectTitle: 'Project A',
  },
  {
    src: '/images/project-b.png',
    alt: 'Project B screenshot',
    caption: 'Second caption',
    projectTitle: 'Project B',
  },
];

describe('<ProjectImageSlideshow />', () => {
  it('renders the current project image and advances to the next slide', async () => {
    const user = userEvent.setup();
    render(<ProjectImageSlideshow images={images} />);

    expect(
      screen.getByRole('heading', { name: /einblicke aus allen projekten/i })
    ).toBeInTheDocument();
    expect(screen.getByAltText('Project A screenshot')).toBeInTheDocument();
    expect(screen.getByText('First caption')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /nächstes projektbild/i }));

    expect(screen.getByAltText('Project B screenshot')).toBeInTheDocument();
    expect(screen.getByText('Second caption')).toBeInTheDocument();
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
  });

  it('renders nothing when no images are provided', () => {
    const { container } = render(<ProjectImageSlideshow images={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
