import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';
import BackgroundAnimation from '../backgroundAnimation';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 88vh;
  height: auto;
  padding: 0;
  position: relative;
  isolation: isolate;

  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: var(--nav-height);
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
    :after {
      content: none;
    }
    :before {
      content: none;
    }
  }

  h3 {
    margin-top: 5px;
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 590px;
    color: var(--light-slate);
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 40px;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    width: 100%;
  }

  .hero-animation {
    position: absolute;
    z-index: 1;
    top: 50%;
    right: -8%;
    width: min(48vw, 620px);
    opacity: 0.32;
    transform: translateY(-50%);
    pointer-events: none;
    user-select: none;

    @media (prefers-reduced-motion: reduce) {
      display: none;
    }

    @media (max-width: 768px) {
      right: 0;
      width: 85vw;
      opacity: 0.18;
    }
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const one = <h1 className="numbered-heading">Hi, my name is</h1>;
  const two = <h2 className="big-heading">Rene Gonzalez.</h2>;
  const three = <h3 className="medium-heading">I build useful software.</h3>;
  const four = (
    <div>
      <p>
        I’m a software engineer based in Toronto. I’ve worked at{' '}
        <a href="https://www.commure.com/">Commure</a>,{' '}
        <a href="https://www.wsib.ca/">WSIB</a>, <a href="https://www.toolbx.com/">Toolbx</a>,{' '}
        <a href="https://www.livecoinwatch.com/">Live Coin Watch</a>, and{' '}
        <a href="https://www.ducapp.com/">DUC APP</a>.
      </p>
      <p>Away from my keyboard, I’m usually planning the next backpacking trip.</p>
    </div>
  );
  const five = (
    <a className="email-link" rel="noreferrer" href="/Rene_Gonzalez_resume.pdf">
      View my resume
    </a>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
      <div className="hero-content">
        {prefersReducedMotion ? (
          <>
            {items.map((item, i) => (
              <div key={i}>{item}</div>
            ))}
          </>
        ) : (
          <TransitionGroup component={null}>
            {isMounted &&
              items.map((item, i) => (
                <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                  <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
                </CSSTransition>
              ))}
          </TransitionGroup>
        )}
      </div>
      <div className="hero-animation" aria-hidden="true">
        <BackgroundAnimation />
      </div>
    </StyledHeroSection>
  );
};

export default Hero;
