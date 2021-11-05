import { Theme as EmotionTheme } from 'util/theming';

declare module '@emotion/react' {
  export interface Theme extends EmotionTheme {}
}
