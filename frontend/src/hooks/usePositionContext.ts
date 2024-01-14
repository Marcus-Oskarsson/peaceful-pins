import { useContext } from 'react';
import { PositionContext } from '@contexts/PositionContext';

export const usePositionContext = () => useContext(PositionContext);
