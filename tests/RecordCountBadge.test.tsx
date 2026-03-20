import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecordCountBadge from '../components/RecordCountBadge';

describe('RecordCountBadge', () => {
  it('hiển thị "Chưa có bữa ăn nào được chọn" khi count = 0', () => {
    render(<RecordCountBadge count={0} />);
    expect(screen.getByText('Chưa có bữa ăn nào được chọn')).toBeInTheDocument();
  });

  it('không hiển thị "Sẽ lưu 0 bản ghi" khi count = 0', () => {
    render(<RecordCountBadge count={0} />);
    expect(screen.queryByText(/Sẽ lưu 0 bản ghi/)).not.toBeInTheDocument();
  });

  it('hiển thị "Sẽ lưu X bản ghi" khi count > 0', () => {
    render(<RecordCountBadge count={5} />);
    expect(screen.getByText('Sẽ lưu 5 bản ghi')).toBeInTheDocument();
  });

  it('hiển thị đúng số bản ghi với count lớn', () => {
    render(<RecordCountBadge count={100} />);
    expect(screen.getByText('Sẽ lưu 100 bản ghi')).toBeInTheDocument();
  });
});
