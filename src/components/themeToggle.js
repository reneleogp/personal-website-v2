import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledThemeToggle = styled.button`
  display: inline-grid;
  width: 34px;
  height: 34px;
  margin-left: 10px;
  padding: 0;
  place-items: center;
  border: 1px solid var(--lightest-navy);
  border-radius: 50%;
  background-color: transparent;
  color: var(--light-slate);
  transition: var(--transition);

  &:hover,
  &:focus-visible {
    border-color: var(--green);
    color: var(--green);
    background-color: var(--green-tint);
    outline: none;
    transform: translateY(-2px);
  }

  span {
    font-size: 17px;
    line-height: 1;
  }
`;

const ThemeToggle = ({ className }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const syncTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setTheme(currentTheme === 'dark' ? 'dark' : 'light');
    };

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    syncTheme();

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem('theme', nextTheme);
    } catch {
      // The selected theme still applies for this page when storage is unavailable.
    }
    setTheme(nextTheme);
  };

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <StyledThemeToggle
      className={className}
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} theme`}
      aria-pressed={theme === 'dark'}
      title={`Switch to ${nextTheme} theme`}>
      <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
    </StyledThemeToggle>
  );
};

ThemeToggle.propTypes = {
  className: PropTypes.string,
};

export default ThemeToggle;
