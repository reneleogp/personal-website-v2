import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledJobsSection = styled.section`
  max-width: 760px;
`;

const StyledTimeline = styled.ol`
  position: relative;
  padding: 0;
  margin: 0;
  list-style: none;

  &:before {
    content: '';
    position: absolute;
    top: 10px;
    bottom: 10px;
    left: 6px;
    width: 1px;
    background-color: var(--lightest-navy);
  }
`;

const StyledTimelineItem = styled.li`
  position: relative;
  display: grid;
  grid-template-columns: minmax(110px, 145px) 1fr;
  gap: 28px;
  align-items: baseline;
  padding: 0 0 34px 38px;
  transition: var(--transition);

  &:last-child {
    padding-bottom: 0;
  }

  &:before {
    content: '';
    position: absolute;
    top: 3px;
    left: 0;
    width: 13px;
    height: 13px;
    border: 2px solid var(--green);
    border-radius: 50%;
    background-color: var(--navy);
    transition: var(--transition);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 7px;
    padding: 0 0 28px 34px;
  }

  &:hover {
    &:before {
      background-color: var(--green);
      transform: scale(1.12);
    }
  }

  .range {
    margin: 0;
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }

  .company-row {
    display: flex;
    gap: 12px;
    align-items: baseline;
    justify-content: space-between;

    @media (max-width: 600px) {
      display: block;
    }
  }

  h3 {
    margin: 0;
    font-size: var(--fz-xxl);
    font-weight: 500;
  }

  .location {
    margin: 0;
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    text-align: right;

    @media (max-width: 600px) {
      margin-top: 5px;
      text-align: left;
    }
  }
`;

const Jobs = () => {
  const data = useStaticQuery(graphql`
    query {
      jobs: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/jobs/" } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              company
              location
              range
              url
            }
          }
        }
      }
    }
  `);

  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!prefersReducedMotion) {
      sr.reveal(revealContainer.current, srConfig());
    }
  }, []);

  return (
    <StyledJobsSection id="jobs" ref={revealContainer}>
      <h2 className="numbered-heading">Timeline</h2>

      <StyledTimeline aria-label="Work timeline">
        {data.jobs.edges.map(({ node }) => {
          const { company, location, range, url } = node.frontmatter;

          return (
            <StyledTimelineItem key={company}>
              <p className="range">{range}</p>
              <div className="company-row">
                <h3>
                  <a href={url} className="inline-link">
                    {company}
                  </a>
                </h3>
                <p className="location">{location}</p>
              </div>
            </StyledTimelineItem>
          );
        })}
      </StyledTimeline>
    </StyledJobsSection>
  );
};

export default Jobs;
