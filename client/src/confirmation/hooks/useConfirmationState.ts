import { useLocation } from 'react-router-dom';
import { ConfirmationState } from '../types';

export function useConfirmationState() {
  const { state } = useLocation();
  const data = (state as ConfirmationState) || undefined;

  const isMissing = !data;
  const isInvalid = data?.success && (!data.serviceId || !data.totalAmount);

  return { data, isMissing, isInvalid };
}