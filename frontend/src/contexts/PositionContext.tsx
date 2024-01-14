import React, { createContext } from 'react';
import { usePosition } from '@hooks/usePosition';

type PositionContextType = {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  error: string | null;
} | null;

export const PositionContext = createContext<PositionContextType>(null);

export const PositionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const position = usePosition();

  return (
    <PositionContext.Provider value={position}>
      {children}
    </PositionContext.Provider>
  );
};
