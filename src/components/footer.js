import React from 'react';
import styled from 'styled-components';
import { Icon } from '@components/icons';
import { email, socialMedia } from '@config';

const StyledFooter = styled.footer`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 28px 150px 32px;
  color: var(--light-slate);
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);

  @media (max-width: 1080px) {
    padding: 28px 100px 32px;
  }

  @media (max-width: 768px) {
    padding: 24px 50px 28px;
  }

  @media (max-width: 480px) {
    padding: 22px 25px 26px;
  }
`;

const StyledSocialLinks = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  ul {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0;
    margin: 0;
    list-style: none;

    a {
      display: flex;
      padding: 10px;

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
`;

const StyledMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-top: 18px;
  border-top: 1px solid var(--lightest-navy);
  line-height: 1.5;

  time {
    color: var(--slate);
  }

  @media (max-width: 480px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }
`;

const Footer = () => {
  return (
    <StyledFooter>
      <StyledSocialLinks>
        <ul>
          {socialMedia &&
            socialMedia.map(({ name, url }) => (
              <li key={name}>
                <a href={url} aria-label={name} title={name}>
                  <Icon name={name} />
                </a>
              </li>
            ))}
          <li>
            <a href={`mailto:${email}`} aria-label={`Email ${email}`} title="Email">
              <Icon name="Email" />
            </a>
          </li>
        </ul>
      </StyledSocialLinks>

      <StyledMeta>
        <span>Rene Gonzalez</span>
        <time dateTime="2026-08-05">Last updated August 5, 2026</time>
      </StyledMeta>
    </StyledFooter>
  );
};

export default Footer;
