import styled from '@emotion/styled';

import { V } from 'util/theming';

export const WidgetContainer = styled.div`
  background-color: ${V.color.back};
  border: 1px solid ${V.color.backSofter};
  border-radius: ${V.size.borderRadius};
`;

export const WidgetTitle = styled.h2<{ bottomBorder?: boolean }>`
  padding-left: 28px;
  padding-top: 28px;
  padding-bottom: 1rem;
  margin: 0;
  color: ${V.color.front};
  line-height: 24px;
  border-bottom: 1px solid ${p => (p.bottomBorder ? V.color.backSoftest : 'transparent')};
`;

export const WidgetDivider = styled.hr`
  border: 1px solid ${V.color.backSoftest};
`;

export const EmbedRoot = styled.div``;

export const EmbedContentContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: calc(100% - 24px - 28px - 1rem);
`;

export const GrayLabel = styled.p`
  font-size: var(--font-size-additional-p);
  color: var(--color-darkerGray);
  margin: 0;
  padding: 0;
`;

export const GrayLabelUppercase = styled(GrayLabel)`
  text-transform: uppercase;
`;

export const HSpaceBig = styled.div`
  width: 32px;
`;
export const HSpaceMed = styled.div`
  width: 16px;
`;
export const HSpaceSmall = styled.div`
  width: 12px;
`;
export const HSpaceTiny = styled.div`
  width: 8px;
`;

export const VSpaceBig = styled.div`
  height: 32px;
`;
export const VSpaceMed = styled.div`
  height: 16px;
`;
export const VSpaceSmall = styled.div`
  height: 12px;
`;
export const VSpaceTiny = styled.div`
  height: 8px;
`;

type RowProp = {
  center?: boolean;
};

export const RowWrapper = styled.div<RowProp>`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: ${p => (p.center ? 'center' : 'flex-start')};
`;

export const ColWrapper = styled.div<RowProp>`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: ${p => (p.center ? 'center' : 'flex-start')};
`;
