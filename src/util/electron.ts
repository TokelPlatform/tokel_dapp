import { ipcRenderer } from 'electron';

export function helloWorld(info: string): void {
  ipcRenderer.sendSync('hello-world', info);
}

export function helloDolly(info: string): void {
  ipcRenderer.sendSync('hello-dolly', info);
}
