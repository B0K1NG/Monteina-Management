import { useState } from 'react';
import { changePassword } from '../../api/auth';
import { toast } from 'react-toastify';

interface Props {
  onClose(): void;
}

export default function PasswordModal({ onClose }: Props) {
  const [current, setCurrent] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirm, setConfirm] = useState('');

  const handle = async () => {
    if (newPwd !== confirm) {
      toast.error('Nauji slaptažodžiai nesutampa.');
      return;
    }
    try {
      await changePassword(current, newPwd);
      toast.success('Slaptažodis sėkmingai pakeistas!');
      setTimeout(onClose, 2000);
    } catch {
      toast.error('Įvestas neteisingas dabartinis slaptažodis!');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Keisti slaptažodį</h2>
        <input
          type="password"
          placeholder="Dabartinis slaptažodis"
          value={current}
          onChange={e => setCurrent(e.target.value)}
        />
        <input
          type="password"
          placeholder="Naujas slaptažodis"
          value={newPwd}
          onChange={e => setNewPwd(e.target.value)}
        />
        <input
          type="password"
          placeholder="Pakartokite naują slaptažodį"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        />
        <div className="modal-buttons">
          <button
            className="btn btn--secondary close-modal-button"
            onClick={onClose}
          >
            Uždaryti
          </button>
          <button
            className="btn btn--primary confirm-button"
            onClick={handle}
          >
            Atnaujinti slaptažodį
          </button>
        </div>
      </div>
    </div>
  );
}