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
  padding: 0;
  margin: 0;
  border-top: 1px solid var(--lightest-navy);
  list-style: none;
`;

const StyledTimelineItem = styled.li`
  display: grid;
  grid-template-columns: minmax(110px, 145px) 1fr;
  gap: 28px;
  align-items: baseline;
  padding: 20px 0;
  border-bottom: 1px solid var(--lightest-navy);
  transition: var(--transition);

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 7px;
    padding: 18px 0;
  }

  &:hover {
    padding-left: 10px;
    border-color: var(--green);
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
      <h2 className="numbered-heading">Where I’ve Worked</h2>

      <StyledTimeline>
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
