import React, { createContext, useContext } from 'react';

export const Platform = {
  MAC: 'mac',
  LINUX: 'linux',
  WINDOWS: 'windows',
  OTHER: 'other',
};

const PlatformContext = createContext(null);

export const checkPlatform = () => {
  const navigatorPlatform = window.navigator.platform;
  let platform;
  if (['Mac', 'Macintosh', 'MacIntel'].indexOf(navigatorPlatform) !== -1) {
    platform = Platform.MAC;
  } else if (['Win', 'Win32', 'Win64', 'Windows'].indexOf(navigatorPlatform) !== -1) {
    platform = Platform.WINDOWS;
  } else if (/Linux/.test(navigatorPlatform)) {
    platform = Platform.LINUX;
  } else {
    platform = Platform.OTHER;
  }
  return platform;
};

interface PlatformProviderProps {
  children: JSX.Element | JSX.Element[] | string;
}

const PlatformProvider = ({ children }: PlatformProviderProps) => {
  const platform = checkPlatform();
  return <PlatformContext.Provider value={platform}>{children}</PlatformContext.Provider>;
};

export default PlatformProvider;
export const usePlatform = () => useContext(PlatformContext);
