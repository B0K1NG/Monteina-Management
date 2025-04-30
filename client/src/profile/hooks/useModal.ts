import { useState } from 'react';
import { ModalType } from '../types';

export function useModal() {
  const [modal, setModal] = useState<ModalType | null>(null);

  const openPassword = () => setModal({ type: 'password' });
  const openCancel = (bookingId: number) =>
    setModal({ type: 'cancel', bookingId });
  const openInvoice = (invoice: any) =>
    setModal({ type: 'invoice', invoice });
  const close = () => setModal(null);

  return { modal, openPassword, openCancel, openInvoice, close };
}
