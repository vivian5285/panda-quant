import React, { createContext, useContext, useState, ReactNode } from 'react';

type BackgroundTheme = 'light' | 'dark' | 'gradient';

interface BackgroundContextType {
  backgroundTheme: BackgroundTheme;
  setBackgroundTheme: (theme: BackgroundTheme) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const BackgroundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>('dark');

  return (
    <BackgroundContext.Provider value={{ backgroundTheme, setBackgroundTheme }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackgroundContext = () => {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackgroundContext must be used within a BackgroundProvider');
  }
  return context;
}; 