import React from 'react';
import { render } from '@testing-library/react';

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: () => null,
  Navigate: () => null,
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}), { virtual: true });

// Mock Lucide icons or other ESM dependencies if required
jest.mock('./App/Dashboard', () => () => <div>Dashboard</div>);
jest.mock('./components/auth/Login', () => () => <div>Login</div>);
jest.mock('./components/auth/Register', () => () => <div>Register</div>);
jest.mock('./components/landing/LandingPage', () => () => <div>LandingPage</div>);

import App from './App';

test('renders App without crashing', () => {
  const { container } = render(<App />);
  expect(container).toBeDefined();
});
