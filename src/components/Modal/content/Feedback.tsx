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
`;

const Feedback = () => {
  return (
    <FeedbackRoot>
      <h4>Please, share your feedback with us so we can improve.</h4>
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
      <p
        style={{
          margin: '2rem 1.5rem 2rem 0',
          textAlign: 'right',
        }}
      >
        Yours sincerely, TOKEL team
      </p>
    </FeedbackRoot>
  );
};

export default Feedback;
