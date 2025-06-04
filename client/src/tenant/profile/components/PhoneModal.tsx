import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../../api/axios';

interface Props {
  currentPhone: string;
  onClose(): void;
  onUpdate(newPhone: string): void;
}

export default function PhoneModal({ currentPhone, onClose, onUpdate }: Props) {
  const [phoneNumber, setPhoneNumber] = useState(currentPhone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await axios.patch('/api/profile/update-phone', { phoneNumber });
      toast.success('Telefono numeris atnaujintas sėkmingai');
      onUpdate(phoneNumber);
      onClose();
    } catch (error) {
      toast.error('Nepavyko atnaujinti telefono numerio');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Keisti telefono numerį</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Naujas telefono numeris</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              placeholder="+370..."
            />
          </div>
          <div className="modal-buttons">
            <button type="button" className="btn btn--secondary" onClick={onClose}>
              Atšaukti
            </button>
            <button type="submit" className="btn btn--primary">
              Išsaugoti
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}