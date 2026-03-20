import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModeToggle from '../components/ModeToggle';

describe('ModeToggle', () => {
  it('renders both "Một ngày" and "Khoảng ngày" buttons', () => {
    render(<ModeToggle mode="single" onChange={() => {}} />);
    expect(screen.getByText('Một ngày')).toBeInTheDocument();
    expect(screen.getByText('Khoảng ngày')).toBeInTheDocument();
  });

  it('highlights the active "Một ngày" button when mode is single', () => {
    render(<ModeToggle mode="single" onChange={() => {}} />);
    const singleBtn = screen.getByText('Một ngày');
    const rangeBtn = screen.getByText('Khoảng ngày');
    expect(singleBtn).toHaveClass('bg-blue-600');
    expect(rangeBtn).not.toHaveClass('bg-blue-600');
  });

  it('highlights the active "Khoảng ngày" button when mode is range', () => {
    render(<ModeToggle mode="range" onChange={() => {}} />);
    const singleBtn = screen.getByText('Một ngày');
    const rangeBtn = screen.getByText('Khoảng ngày');
    expect(rangeBtn).toHaveClass('bg-blue-600');
    expect(singleBtn).not.toHaveClass('bg-blue-600');
  });

  it('calls onChange with "range" when "Khoảng ngày" is clicked', () => {
    const onChange = jest.fn();
    render(<ModeToggle mode="single" onChange={onChange} />);
    fireEvent.click(screen.getByText('Khoảng ngày'));
    expect(onChange).toHaveBeenCalledWith('range');
  });

  it('calls onChange with "single" when "Một ngày" is clicked', () => {
    const onChange = jest.fn();
    render(<ModeToggle mode="range" onChange={onChange} />);
    fireEvent.click(screen.getByText('Một ngày'));
    expect(onChange).toHaveBeenCalledWith('single');
  });
});
