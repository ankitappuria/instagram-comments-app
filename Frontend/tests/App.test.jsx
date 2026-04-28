import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';
import * as useCommentModule from '../src/features/comments/hooks/useComment';

// Mock child components
vi.mock('../src/features/post/components/PostCard', () => ({
  default: () => React.createElement('div', { 'data-testid': 'post-card' }, 'Post Card')
}));

vi.mock('../src/features/comments/components/CommentList', () => ({
  default: ({ comments, loading, loadingMore, hasMore, onLoadMore, currentUser }) =>
    React.createElement(
      'div',
      { 'data-testid': 'comment-list' },
      React.createElement('div', { 'data-testid': 'comment-count' }, comments.length),
      React.createElement('div', { 'data-testid': 'is-loading' }, loading ? 'loading' : 'not-loading'),
      React.createElement('div', { 'data-testid': 'is-loading-more' }, loadingMore ? 'loading-more' : 'not-loading-more'),
      React.createElement('div', { 'data-testid': 'has-more' }, hasMore ? 'has-more' : 'no-more'),
      React.createElement('div', { 'data-testid': 'current-user-prop' }, currentUser),
      hasMore && React.createElement('button', { 'data-testid': 'load-more-btn', onClick: onLoadMore }, 'Load More')
    )
}));

vi.mock('../src/features/comments/components/CommentInput', () => ({
  default: ({ onSubmit, placeholder }) =>
    React.createElement(
      'div',
      { 'data-testid': 'comment-input' },
      React.createElement('input', {
        'data-testid': 'input-field',
        placeholder,
        onKeyPress: (e) => {
          if (e.key === 'Enter') {
            onSubmit(e.target.value);
            e.target.value = '';
          }
        }
      })
    )
}));

vi.mock('../src/features/comments/components/UserModal', () => ({
  default: ({ currentUser, onSave, onClose }) =>
    React.createElement(
      'div',
      { 'data-testid': 'user-modal' },
      React.createElement('input', {
        'data-testid': 'modal-input',
        defaultValue: currentUser,
        onBlur: (e) => onSave(e.target.value)
      }),
      React.createElement('button', { 'data-testid': 'modal-close-btn', onClick: onClose }, 'Close')
    )
}));

vi.mock('../src/shared/components/Avatar/Avatar', () => ({
  default: ({ name, size }) =>
    React.createElement('div', { 'data-testid': 'avatar', 'data-name': name, 'data-size': size }, `Avatar: ${name}`)
}));

// Mock the useComments hook
const mockUseComments = vi.fn();
beforeEach(() => {
  vi.spyOn(useCommentModule, 'useComments').mockImplementation(mockUseComments);
});

describe('App Component', () => {
  const defaultMockData = {
    comments: [
      { id: 1, userName: 'User1', content: 'Great post!' },
      { id: 2, userName: 'User2', content: 'Amazing!' }
    ],
    loading: false,
    loadingMore: false,
    hasMore: true,
    loadMore: vi.fn(),
    addComment: vi.fn(),
    error: null
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseComments.mockReturnValue(defaultMockData);
  });

  it.only('should render the main application layout', () => {
    render(<App />);

    expect(screen.getByText('Comments')).toBeInTheDocument();
    expect(screen.getByTestId('post-card')).toBeInTheDocument();
    expect(screen.getByTestId('comment-list')).toBeInTheDocument();
    expect(screen.getByTestId('comment-input')).toBeInTheDocument();
  });

  it('should render with default user "You"', () => {
    render(<App />);

    expect(screen.getByText(/Posting as/)).toBeInTheDocument();
    const userSpan = within(screen.getByRole('button', { name: /Posting as/ })).getByText('You');
    expect(userSpan).toBeInTheDocument();
  });

  it('should render header with back icon and user button', () => {
    render(<App />);

    const backIcon = document.querySelector('.app-header-back-icon');
    expect(backIcon).toBeInTheDocument();

    const userButton = screen.getByRole('button', { name: /Posting as/ });
    expect(userButton).toBeInTheDocument();
  });

  it('should show UserModal when user button is clicked', async () => {
    render(<App />);

    const userButton = screen.getByRole('button', { name: /Posting as/ });
    fireEvent.click(userButton);

    await waitFor(() => {
      expect(screen.getByTestId('user-modal')).toBeInTheDocument();
    });
  });

  it('should hide UserModal when close button is clicked', async () => {
    render(<App />);

    const userButton = screen.getByRole('button', { name: /Posting as/ });
    fireEvent.click(userButton);

    await waitFor(() => {
      expect(screen.getByTestId('user-modal')).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId('modal-close-btn');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('user-modal')).not.toBeInTheDocument();
    });
  });

  it('should update currentUser when modal saves new user name', async () => {
    render(<App />);

    const userButton = screen.getByRole('button', { name: /Posting as/ });
    fireEvent.click(userButton);

    const modalInput = await screen.findByTestId('modal-input');
    fireEvent.change(modalInput, { target: { value: 'Alice' } });
    fireEvent.blur(modalInput);

    const closeButton = screen.getByTestId('modal-close-btn');
    fireEvent.click(closeButton);

    await waitFor(() => {
      const updatedUserButton = screen.getByRole('button', { name: /Posting as/ });
      const userSpan = within(updatedUserButton).getByText('Alice');
      expect(userSpan).toBeInTheDocument();
    });
  });

  it('should pass correct props to CommentList', () => {
    const mockData = {
      ...defaultMockData,
      comments: [{ id: 1, content: 'Test' }],
      loading: true,
      hasMore: false
    };
    mockUseComments.mockReturnValue(mockData);

    render(<App />);

    expect(screen.getByTestId('comment-count')).toHaveTextContent('1');
    expect(screen.getByTestId('is-loading')).toHaveTextContent('loading');
    expect(screen.getByTestId('has-more')).toHaveTextContent('no-more');
  });

  it('should call loadMore when onLoadMore callback is triggered', async () => {
    const mockLoadMore = vi.fn();
    mockUseComments.mockReturnValue({
      ...defaultMockData,
      loadMore: mockLoadMore
    });

    render(<App />);

    const loadMoreBtn = screen.getByTestId('load-more-btn');
    fireEvent.click(loadMoreBtn);

    await waitFor(() => {
      expect(mockLoadMore).toHaveBeenCalled();
    });
  });

  it('should call addComment when handlePost is triggered', async () => {
    const mockAddComment = vi.fn();
    mockUseComments.mockReturnValue({
      ...defaultMockData,
      addComment: mockAddComment
    });

    render(<App />);

    const inputField = screen.getByTestId('input-field');
    
    await userEvent.type(inputField, 'Test comment');
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(mockAddComment).toHaveBeenCalledWith('You', 'Test comment');
    });
  });

  it('should use current user when posting comment', async () => {
    const mockAddComment = vi.fn();
    mockUseComments.mockReturnValue({
      ...defaultMockData,
      addComment: mockAddComment
    });

    render(<App />);

    // Change the user name first
    const userButton = screen.getByRole('button', { name: /Posting as/ });
    fireEvent.click(userButton);

    const modalInput = await screen.findByTestId('modal-input');
    fireEvent.change(modalInput, { target: { value: 'Bob' } });
    fireEvent.blur(modalInput);

    // Close modal
    const closeButton = screen.getByTestId('modal-close-btn');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('user-modal')).not.toBeInTheDocument();
    });

    // Now post a comment
    const inputField = screen.getByTestId('input-field');
    await userEvent.type(inputField, 'Bob comment');
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(mockAddComment).toHaveBeenCalledWith('Bob', 'Bob comment');
    });
  });

  it('should render Avatar component with current user name', () => {
    render(<App />);

    const avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveAttribute('data-name', 'You');
  });

  it('should pass correct user name to CommentList', () => {
    render(<App />);

    expect(screen.getByTestId('current-user-prop')).toHaveTextContent('You');
  });

  it('should handle comments array from useComments hook', () => {
    const mockData = {
      ...defaultMockData,
      comments: [
        { id: 1, userName: 'Alice', content: 'First comment' },
        { id: 2, userName: 'Bob', content: 'Second comment' },
        { id: 3, userName: 'Charlie', content: 'Third comment' }
      ]
    };
    mockUseComments.mockReturnValue(mockData);

    render(<App />);

    expect(screen.getByTestId('comment-count')).toHaveTextContent('3');
  });

  it('should handle loading state', () => {
    const mockData = {
      ...defaultMockData,
      loading: true
    };
    mockUseComments.mockReturnValue(mockData);

    render(<App />);

    expect(screen.getByTestId('is-loading')).toHaveTextContent('loading');
  });

  it('should handle loadingMore state', () => {
    const mockData = {
      ...defaultMockData,
      loadingMore: true
    };
    mockUseComments.mockReturnValue(mockData);

    render(<App />);

    expect(screen.getByTestId('is-loading-more')).toHaveTextContent('loading-more');
  });

  it('should pass correct POST_ID to useComments hook', () => {
    render(<App />);

    expect(mockUseComments).toHaveBeenCalledWith('post_123');
  });

  it('should render modal conditionally when showModal is true', async () => {
    const { rerender } = render(<App />);

    expect(screen.queryByTestId('user-modal')).not.toBeInTheDocument();

    const userButton = screen.getByRole('button', { name: /Posting as/ });
    fireEvent.click(userButton);

    await waitFor(() => {
      expect(screen.getByTestId('user-modal')).toBeInTheDocument();
    });
  });

  it('should render with comments when data is available', () => {
    const mockData = {
      ...defaultMockData,
      comments: [{ id: 1 }, { id: 2 }],
      loading: false
    };
    mockUseComments.mockReturnValue(mockData);

    render(<App />);

    expect(screen.getByTestId('comment-count')).toHaveTextContent('2');
    expect(screen.getByTestId('is-loading')).toHaveTextContent('not-loading');
  });

  it('should have hasMore button only when hasMore is true', () => {
    const mockData = {
      ...defaultMockData,
      hasMore: false
    };
    mockUseComments.mockReturnValue(mockData);

    render(<App />);

    expect(screen.queryByTestId('load-more-btn')).not.toBeInTheDocument();
  });

  it('should handle empty comments array', () => {
    const mockData = {
      ...defaultMockData,
      comments: []
    };
    mockUseComments.mockReturnValue(mockData);

    render(<App />);

    expect(screen.getByTestId('comment-count')).toHaveTextContent('0');
  });
});
