import { css } from 'styled-components';

const variables = css`
  :root {
    color-scheme: light;
    --dark-navy: #e8edf5;
    --navy: #f7f9fc;
    --navy-rgb: 247, 249, 252;
    --light-navy: #ffffff;
    --lightest-navy: #d9e2ef;
    --navy-shadow: rgba(15, 23, 42, 0.18);
    --dark-slate: #64748b;
    --slate: #64748b;
    --light-slate: #334155;
    --lightest-slate: #0f172a;
    --white: #020617;
    --green: #2563eb;
    --green-tint: rgba(37, 99, 235, 0.08);
    --pink: #db2777;
    --blue: #0891b2;
    --animation-rgb: 37, 99, 235;

    --font-sans: 'Calibre', 'Inter', 'San Francisco', 'SF Pro Text', -apple-system, system-ui,
      sans-serif;
    --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;

    --fz-xxs: 12px;
    --fz-xs: 13px;
    --fz-sm: 14px;
    --fz-md: 16px;
    --fz-lg: 18px;
    --fz-xl: 20px;
    --fz-xxl: 22px;
    --fz-heading: 32px;

    --border-radius: 4px;
    --nav-height: 100px;
    --nav-scroll-height: 70px;

    --tab-height: 42px;
    --tab-width: 120px;

    --easing: cubic-bezier(0.645, 0.045, 0.355, 1);
    --transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);

    --hamburger-width: 30px;

    --ham-before: top 0.1s ease-in 0.25s, opacity 0.1s ease-in;
    --ham-before-active: top 0.1s ease-out, opacity 0.1s ease-out 0.12s;
    --ham-after: bottom 0.1s ease-in 0.25s, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    --ham-after-active: bottom 0.1s ease-out,
      transform 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s;
  }

  html[data-theme='dark'] {
    color-scheme: dark;
    --dark-navy: #080c14;
    --navy: #0d1422;
    --navy-rgb: 13, 20, 34;
    --light-navy: #141e30;
    --lightest-navy: #263550;
    --navy-shadow: rgba(2, 6, 23, 0.7);
    --dark-slate: #56657c;
    --slate: #8796ab;
    --light-slate: #c3ccda;
    --lightest-slate: #eef3f8;
    --white: #f8fafc;
    --green: #7aa2ff;
    --green-tint: rgba(122, 162, 255, 0.1);
    --pink: #f472b6;
    --blue: #67e8f9;
    --animation-rgb: 122, 162, 255;
  }
`;

export default variables;
