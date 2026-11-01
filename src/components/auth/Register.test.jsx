import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Register } from './Register';
import { AuthProvider } from '../../context/AuthContext';
import { api } from '../../services/api';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/register' }),
}), { virtual: true });

jest.mock('../../services/api', () => {
  const original = jest.requireActual('../../services/api');
  return {
    ...original,
    api: {
      post: jest.fn(),
      get: jest.fn(),
    },
  };
});

describe('Register component flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    window.alert = jest.fn();
  });

  test('successfully registers, saves token and user, and redirects to dashboard', async () => {
    api.post.mockResolvedValueOnce({
      status: 200,
      data: {
        message: 'User registered successfully',
        token: 'mock-access-token',
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        token_type: 'bearer',
        user: {
          id: 42,
          name: 'Preet Parihar',
          username: 'preetparihar',
          email: 'preet@example.com',
          profile_pic: '/profile.png',
        },
      },
    });

    render(
      <AuthProvider>
        <Register />
      </AuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Full Name'), {
      target: { value: 'Preet Parihar' },
    });
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'preetparihar' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'preet@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'Password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'Password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/users/register', {
        name: 'Preet Parihar',
        username: 'preetparihar',
        email: 'preet@example.com',
        password: 'Password123',
      });
    });

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('mock-access-token');
      expect(localStorage.getItem('refresh_token')).toBe('mock-refresh-token');
      expect(JSON.parse(localStorage.getItem('user'))).toEqual(
        expect.objectContaining({
          username: 'preetparihar',
          email: 'preet@example.com',
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('alerts and navigates to login if token is missing from response', async () => {
    api.post.mockResolvedValueOnce({
      status: 200,
      data: {
        message: 'Account created without token',
      },
    });

    render(
      <AuthProvider>
        <Register />
      </AuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Full Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'Password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'Password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Account created without token');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
