import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default message', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading medical data...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    const customMessage = 'Loading patient records...';
    render(<LoadingSpinner message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const heartIcon = container.querySelector('.h-12.w-12');
    expect(heartIcon).toBeInTheDocument();
  });
});