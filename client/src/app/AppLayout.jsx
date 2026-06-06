import { Link, NavLink, Outlet } from 'react-router-dom';
import { LogOut, Moon, SunMedium } from 'lucide-react';
import { driverNavItems, getDefaultRouteForRole } from './navigation.js';
import { useAuth } from '../features/auth/useAuth.js';
import { useTheme } from '../features/theme/useTheme.js';
import { NotificationBell } from '../features/notifications/NotificationBell.jsx';
import { ChatWidget } from '../features/chat/ChatWidget.jsx';

export function AppLayout() {
  const { isAuthenticated, logout, user } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDriver = user?.role === 'driver';
  const isWorkspaceRole = user?.role === 'owner' || user?.role === 'admin';
  const driverLinks = isAuthenticated && isDriver ? driverNavItems : [];

  return (
    <div className="app-shell">
      <header
        style={{
          borderBottom: '1px solid var(--app-border)',
          background: 'var(--app-surface)',
          boxShadow: '0 1px 0 var(--app-border)',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">

          {/* ── Logo + Brand ── */}
          <Link
            to="/"
            className="flex items-center gap-2.5"
            style={{ textDecoration: 'none' }}
          >
            {/* Logo mark — P in a rounded square */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #20a66b 0%, #116845 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(22,133,86,0.35)',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 800,
                  fontSize: 17,
                  color: '#fff',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                }}
              >
                P
              </span>
            </div>

            {/* Brand name */}
            <span
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700,
                fontSize: '1.15rem',
                letterSpacing: '-0.03em',
                color: 'var(--app-text)',
                lineHeight: 1,
              }}
            >
              Smart
              <span style={{ color: '#168556' }}>Park</span>
            </span>
          </Link>

          {/* ── Guest nav ── */}
          {!isAuthenticated ? (
            <nav
              className="hidden items-center gap-1 text-sm md:flex"
              style={{ color: 'var(--app-text-muted)' }}
            >
              {[
                { to: '/',                  label: 'Explore'         },
                { to: '/parkings',          label: 'All spaces'      },
                { to: '/map',               label: 'Map view'        },
                { to: '/register?role=owner', label: 'List your space' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 10,
                    fontWeight: 500,
                    color: 'var(--app-text-muted)',
                    textDecoration: 'none',
                    transition: 'background 150ms, color 150ms',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--app-surface-muted)';
                    e.currentTarget.style.color = 'var(--app-text)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--app-text-muted)';
                  }}
                >
                  {label}
                </Link>
              ))}

              <Link
                to="/login"
                style={{
                  marginLeft: 4,
                  padding: '7px 16px',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #20a66b 0%, #116845 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(22,133,86,0.3)',
                  transition: 'opacity 150ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Sign in
              </Link>
            </nav>
          ) : null}

          {/* ── Driver nav (centre) ── */}
          {driverLinks.length > 0 ? (
            <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
              {driverLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  style={{ textDecoration: 'none' }}
                  className={({ isActive }) =>
                    [
                      'rounded-xl px-3 py-2 text-sm font-semibold transition',
                      isActive ? 'bg-slate-950 text-white' : '',
                    ].join(' ')
                  }
                  // inline style only for inactive — active gets Tailwind classes above
                  {...{}}
                >
                  {({ isActive }) => (
                    <span
                      style={
                        !isActive
                          ? { color: 'var(--app-text-muted)' }
                          : undefined
                      }
                    >
                      {item.label}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          ) : null}

          {/* ── Right side controls ── */}
          <div className="ml-auto flex items-center gap-2">

            {/* Theme toggle */}
            <button
              aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={toggleTheme}
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 12px',
                borderRadius: 10,
                border: '1px solid var(--app-border)',
                background: 'var(--app-surface-muted)',
                color: 'var(--app-text-muted)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {resolvedTheme === 'dark'
                ? <SunMedium className="h-4 w-4" aria-hidden="true" />
                : <Moon className="h-4 w-4" aria-hidden="true" />}
              <span className="hidden sm:inline">
                {resolvedTheme === 'dark' ? 'Light' : 'Dark'}
              </span>
            </button>

            {/* Authenticated controls */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2" style={{ color: 'var(--app-text-muted)' }}>
                <NotificationBell />

                {isWorkspaceRole ? (
                  <Link
                    to={getDefaultRouteForRole(user?.role)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 10,
                      border: '1px solid var(--app-border)',
                      background: 'var(--app-surface-muted)',
                      color: 'var(--app-text-muted)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    {user?.role === 'admin' ? 'Admin' : 'Dashboard'}
                  </Link>
                ) : null}

                <button
                  type="button"
                  onClick={logout}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '7px 12px',
                    borderRadius: 10,
                    border: '1px solid var(--app-border)',
                    background: 'transparent',
                    color: 'var(--app-text-muted)',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="md:hidden"
                style={{
                  padding: '7px 16px',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #20a66b 0%, #116845 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                }}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>

        {/* ── Mobile driver nav (scroll row) ── */}
        {driverLinks.length > 0 ? (
          <nav
            className="flex gap-1.5 overflow-x-auto px-4 py-2 lg:hidden"
            style={{ borderTop: '1px solid var(--app-border)' }}
          >
            {driverLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={{ textDecoration: 'none' }}
                className={({ isActive }) =>
                  [
                    'shrink-0 rounded-xl px-3 py-2 text-sm font-semibold transition whitespace-nowrap',
                    isActive ? 'bg-slate-950 text-white' : '',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <span
                    style={
                      !isActive
                        ? {
                            background: 'var(--app-surface-muted)',
                            color: 'var(--app-text-muted)',
                            borderRadius: 10,
                            padding: '6px 12px',
                          }
                        : undefined
                    }
                  >
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        ) : null}
      </header>

      <main>
        <Outlet />
      </main>

      <ChatWidget />
    </div>
  );
}