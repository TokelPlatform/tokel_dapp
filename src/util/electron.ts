import { ipcRenderer } from 'electron';

export function showDash(): void {
  ipcRenderer.sendSync('show-dash', '');
}

export function hello(): string {
  return 'hello';
}
