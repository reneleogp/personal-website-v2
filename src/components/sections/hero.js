import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  min-height: 100svh;
  height: auto;
  padding: 0;
  position: relative;

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

  p {
    margin: 20px 0 0;
    max-width: 590px;
    color: var(--light-slate);
  }

  .experience-list {
    display: grid;
    gap: 7px;
    max-width: 590px;
    padding: 0;
    margin: 18px 0 0;
    list-style: none;

    li {
      display: flex;
      gap: 11px;
      align-items: baseline;
      color: var(--light-slate);
      line-height: 25px;
    }

    .experience-marker {
      flex: 0 0 7px;
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
      font-weight: 400;
      line-height: inherit;
      text-align: center;
    }
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 40px;
  }

  .hero-content {
    position: relative;
    width: 100%;
  }

  .scroll-cue {
    position: absolute;
    bottom: 30px;
    left: 50%;
    display: grid;
    width: 32px;
    height: 32px;
    place-items: center;
    color: var(--green);
    opacity: 0.7;
    transform: translateX(-50%);

    span {
      font-family: var(--font-mono);
      font-size: 18px;
      line-height: 1;
      transition: var(--transition);
    }

    &:hover,
    &:focus-visible {
      opacity: 1;

      span {
        transform: translateY(3px);
      }
    }

    @media (max-height: 620px) {
      position: relative;
      bottom: auto;
      left: auto;
      align-self: center;
      margin-top: 36px;
      transform: none;
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
  const three = (
    <div>
      <p>
        I’m an Honours Computer Science co-op student at the{' '}
        <a href="https://uwaterloo.ca/">University of Waterloo</a>, graduating in May 2028.
        These are some companies I have worked for in the past:
      </p>
      <ul className="experience-list">
        <li>
          <span className="experience-marker" aria-hidden="true">
            &mdash;
          </span>
          <span>
            <a href="https://azure.microsoft.com/">2x Intern @ Microsoft Azure</a>
          </span>
        </li>
        <li>
          <span className="experience-marker" aria-hidden="true">
            &mdash;
          </span>
          <span>
            <a href="https://www.commure.com/">Commure</a> (HealthTech Unicorn)
          </span>
        </li>
        <li>
          <span className="experience-marker" aria-hidden="true">
            &mdash;
          </span>
          <span>
            <a href="https://www.athelas.com/">Athelas</a> (YC S16)
          </span>
        </li>
      </ul>
    </div>
  );
  const four = (
    <a className="email-link" rel="noreferrer" href="/Rene_Gonzalez_resume.pdf">
      View my resume
    </a>
  );

  const items = [one, two, three, four];

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
      <a className="scroll-cue" href="#timeline" aria-label="View work timeline">
        <span aria-hidden="true">↓</span>
      </a>
    </StyledHeroSection>
  );
};

export default Hero;
