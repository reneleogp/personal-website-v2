/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

const React = require('react');

const themeScript = `
  (function() {
    try {
      var storedTheme = localStorage.getItem('theme');
      document.documentElement.setAttribute(
        'data-theme',
        storedTheme === 'dark' ? 'dark' : 'light'
      );
    } catch (error) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  })();
`;

exports.onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  setHtmlAttributes({ 'data-theme': 'light' });
  setHeadComponents([
    React.createElement('script', {
      key: 'theme-script',
      dangerouslySetInnerHTML: { __html: themeScript },
    }),
  ]);
};