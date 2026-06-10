import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Education } from '../src/components/Education/Education.jsx';

const entry = {
  id: 'bsc-medieninformatik-hfu',
  degree: 'Bachelor of Science',
  subject: 'Medieninformatik',
  institution: 'Hochschule Furtwangen (HFU)',
  period: 'Abschluss 2024',
  location: 'Furtwangen, Deutschland',
  summary: 'Kurzbeschreibung für den Test.',
  highlights: ['Machine Learning', 'Software Engineering'],
  link: { label: 'Hochschule Furtwangen', url: 'https://www.hs-furtwangen.de/' },
};

describe('<Education />', () => {
  it('renders degree, subject and institution', () => {
    render(<Education entries={[entry]} />);
    expect(screen.getByRole('heading', { name: /ausbildung/i })).toBeInTheDocument();
    expect(screen.getByText('Bachelor of Science')).toBeInTheDocument();
    expect(screen.getByText(/Medieninformatik/)).toBeInTheDocument();
    expect(screen.getByText('Hochschule Furtwangen (HFU)')).toBeInTheDocument();
  });

  it('renders highlight pills', () => {
    render(<Education entries={[entry]} />);
    for (const highlight of entry.highlights) {
      expect(screen.getByText(highlight)).toBeInTheDocument();
    }
  });

  it('renders nothing when no entries are provided', () => {
    const { container } = render(<Education entries={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('links to the institution', () => {
    render(<Education entries={[entry]} />);
    const link = screen.getByRole('link', { name: /hochschule furtwangen/i });
    expect(link).toHaveAttribute('href', entry.link.url);
    expect(link).toHaveAttribute('target', '_blank');
  });
});
