import React from 'react';

import styled from '@emotion/styled';

import links from 'util/links';

import CloseModalButton from 'components/_General/CloseButton';

const FeedbackRoot = styled.div`
  color: var(--color-gray);
  font-weight: 400;
  h4 {
    font-weight: 400;
  }
  ul {
    margin-bottom: 3rem;
  }
`;

const Feedback = () => {
  return (
    <FeedbackRoot>
      <h4>Give us your feedback so we can further improve Tokel.</h4>
      <ul>
        <li>
          Feel free to create{' '}
          <a href={links.githubIssue} key="githubIssue" rel="noreferrer" target="_blank">
            an issue for us in Github
          </a>
        </li>
        <li>
          Reach out to the team in{' '}
          <a href={links.discord} key="discordFeedback" rel="noreferrer" target="_blank">
            {' '}
            Discord
          </a>
        </li>
        <li>
          Send us{' '}
          <a href={links.devEmail} key="devEmaillink" rel="noreferrer" target="_blank">
            an email with your thoughts
          </a>
        </li>
      </ul>
      <CloseModalButton />
    </FeedbackRoot>
  );
};

export default Feedback;
