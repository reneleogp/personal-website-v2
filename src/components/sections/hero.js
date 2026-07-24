import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 88vh;
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
      position: relative;
      padding-left: 18px;
      color: var(--light-slate);

      &:before {
        content: '';
        position: absolute;
        top: 0.68em;
        left: 0;
        width: 7px;
        height: 1px;
        background-color: var(--green);
      }
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
        I’m a Computer Science student at the{' '}
        <a href="https://uwaterloo.ca/">University of Waterloo</a>. These are some companies I
        have worked for in the past:
      </p>
      <ul className="experience-list">
        <li>
          <a href="https://azure.microsoft.com/">2x Intern @ Microsoft Azure</a>
        </li>
        <li>
          <a href="https://www.commure.com/">Commure</a> (healthtech unicorn)
        </li>
        <li>
          <a href="https://www.athelas.com/">Athelas</a> (YC S16)
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
    </StyledHeroSection>
  );
};

export default Hero;
