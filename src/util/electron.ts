import { ipcRenderer } from 'electron';

export function showDash(): void {
  console.log('opening the dashboard');
  ipcRenderer.sendSync('show-dash', '');
}

export function hello(): string {
  return 'hello';
}

export function sendInfo(info: string): void {
  console.log('sending info');
  ipcRenderer.sendSync('send-info', info);
}
