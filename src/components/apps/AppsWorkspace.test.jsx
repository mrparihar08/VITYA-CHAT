import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppsWorkspace from './AppsWorkspace';

const mockApps = [
  {
    id: 'chat',
    name: 'AI Chat',
    desc: 'Get instant answers, generate content, and solve problems with advanced AI.',
    icon: 'chat',
    category: 'ai',
    tags: ['AI', 'Productivity'],
    keywords: ['chat', 'ai'],
    popularity: 100,
  },
  {
    id: 'presentation',
    name: 'Prompt to PPT',
    desc: 'Turn your ideas into beautiful presentations in seconds with AI.',
    icon: 'presentation',
    category: 'productivity',
    tags: ['AI', 'Productivity'],
    keywords: ['presentation', 'ppt'],
    popularity: 98,
  },
  {
    id: 'notes',
    name: 'Smart Notes',
    desc: 'Take notes, organize ideas and summarize content with AI assistance.',
    icon: 'notes',
    category: 'productivity',
    tags: ['Productivity', 'AI'],
    keywords: ['notes'],
    popularity: 90,
  },
];

describe('AppsWorkspace Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders workspace title, dynamic tool count and apps', () => {
    render(<AppsWorkspace apps={mockApps} onOpenApp={jest.fn()} />);
    
    expect(screen.getByText('Apps Workspace')).toBeInTheDocument();
    expect(screen.getByText('3 Tools & Apps')).toBeInTheDocument();
    expect(screen.getAllByText('AI Chat').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Prompt to PPT').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Smart Notes')).toBeInTheDocument();
  });

  test('filters tools dynamically when searching', () => {
    render(<AppsWorkspace apps={mockApps} onOpenApp={jest.fn()} />);

    const searchInput = screen.getByPlaceholderText('Search tools and apps...');
    fireEvent.change(searchInput, { target: { value: 'PPT' } });

    expect(screen.getAllByText('Prompt to PPT').length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText('Smart Notes')).not.toBeInTheDocument();
  });

  test('switches category filters correctly', () => {
    render(<AppsWorkspace apps={mockApps} onOpenApp={jest.fn()} />);

    const buttons = screen.getAllByRole('button');
    const productivityTab = buttons.find((b) => b.textContent && b.textContent.includes('Productivity'));
    expect(productivityTab).toBeDefined();
    fireEvent.click(productivityTab);

    expect(productivityTab).toHaveClass('active');
  });

  test('triggers onOpenApp when clicking an app card', () => {
    const handleOpen = jest.fn();
    render(<AppsWorkspace apps={mockApps} onOpenApp={handleOpen} />);

    const launchCards = screen.getAllByTitle('Launch AI Chat');
    fireEvent.click(launchCards[0]);

    expect(handleOpen).toHaveBeenCalledTimes(1);
    expect(handleOpen).toHaveBeenCalledWith(expect.objectContaining({ id: 'chat' }));
  });

  test('toggles favorite when clicking star button without launching app', () => {
    const handleOpen = jest.fn();
    render(<AppsWorkspace apps={mockApps} onOpenApp={handleOpen} />);

    const starBtns = screen.getAllByLabelText('Toggle favorite');
    fireEvent.click(starBtns[0]);

    // Star click should stop propagation, so handleOpen shouldn't be called
    expect(handleOpen).not.toHaveBeenCalled();
  });
});
