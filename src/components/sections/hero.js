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
  height: 100vh;
  padding: 0;

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
    max-width: 540px;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const StyledText = styled.div`
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    grid-gap: 0 10px;
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
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

  const skills = [
    'PostgreSQL',
    'MongoDB',
    'TypeScript',
    'React',
    'Jest',
    'Python',
    'C++',
    'Google Cloud Vision',
  ];

  const skillsComponent = (
    <ul className="skills-list">{skills && skills.map((skill, i) => <li key={i}>{skill}</li>)}</ul>
  );

  const one = <h1 className="numbered-heading">Hi, I'm</h1>;
  const two = <h2 className="big-heading">Rene Gonzalez</h2>;
  const three = <h3 className="medium-heading">A Passionate Software Engineer</h3>;
  const four = (
    <StyledText>
      <p>
        Currently studying Computer Science at the{' '}
        <a href="https://cs.uwaterloo.ca/" target="_blank" rel="noreferrer">
          University of Waterloo.
        </a>
      </p>
      <p>
        I'm an enthusiastic learner, eager to explore the limitless potential of software
        development in tackling real-world challenges, with a particular focus on Cybersecurity,
        Software Innovation and... <br /> Machine Learning (just like everyone in the industry right
        now).
      </p>
      <p>Here are a few technologies I’ve been working with recently:</p>

      {skillsComponent}
    </StyledText>
  );
  const five = (
    <a className="email-link" rel="noreferrer" href="/Rene_Gonzalez_resume.pdf">
      Check out my resume!
    </a>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
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
    </StyledHeroSection>
  );
};

export default Hero;
