import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { UserFormData, User } from '../types';

interface Props {
  isOpen: boolean;
  user?: User;
  onCancel(): void;
  onSave(data: UserFormData): Promise<void>;
}

export default function AddEditUserModal({
  isOpen,
  user,
  onCancel,
  onSave,
}: Props) {
  const [form, setForm] = useState<UserFormData>({
    id: user?.id,
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    password: '',
    role: user?.role || 'client',
    status: user?.status || 'active',
  });

  useEffect(() => {
    setForm({
      id: user?.id,
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      password: '',
      role: user?.role || 'client',
      status: user?.status || 'active',
    });
  }, [user]);

  if (!isOpen) return null;

  const handleButtonClick = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phoneNumber || (!user && !form.password)) {
      toast.info('Prašome užpildyti visus laukus.');
      return;
    }

    onSave(form);
  };

  return (
    <div className="user-modal">
      <div className="user-modal-content">
        <h2>{user ? 'Vartotojo Koregavimas' : 'Vartotojo Pridėjimas'}</h2>
        <form className="user-modal-grid">
          <div className="form-field">
            <label htmlFor="firstName">Vardas</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              placeholder="Vardas"
              value={form.firstName}
              onChange={e =>
                setForm(f => ({ ...f, firstName: e.target.value }))
              }
            />
          </div>

          <div className="form-field">
            <label htmlFor="lastName">Pavardė</label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              placeholder="Pavardė"
              value={form.lastName}
              onChange={e =>
                setForm(f => ({ ...f, lastName: e.target.value }))
              }
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">El. Paštas</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="El. Paštas"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>

          <div className="form-field">
            <label htmlFor="phoneNumber">Tel. Nr.</label>
            <input
              id="phoneNumber"
              type="text"
              name="phoneNumber"
              placeholder="Tel. Nr."
              value={form.phoneNumber}
              onChange={e =>
                setForm(f => ({ ...f, phoneNumber: e.target.value }))
              }
            />
          </div>

          {!user && (
            <div className="form-field">
              <label htmlFor="password">Slaptažodis</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Slaptažodis"
                value={form.password}
                onChange={e =>
                  setForm(f => ({ ...f, password: e.target.value }))
                }
              />
            </div>
          )}

          <div className="form-field">
            <label htmlFor="role">Rolė</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={e =>
                setForm(f => ({ ...f, role: e.target.value as any }))
              }
            >
              <option value="client">Vartotojas</option>
              <option value="admin">Administratorius</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="status">Statusas</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={e =>
                setForm(f => ({ ...f, status: e.target.value as any }))
              }
            >
              <option value="active">Aktyvus</option>
              <option value="blocked">Užblokuotas</option>
              <option value="not_confirmed">Nepatvirtintas</option>
            </select>
          </div>
        </form>

        <div className="modal-buttons">
          <button
            className="btn btn--secondary cancel-button"
            onClick={handleButtonClick}
          >
            {user ? 'Atnaujinti' : 'Patvirtinti'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn--primary suceed-button"
          >
            Uždaryti
          </button>
        </div>
      </div>
    </div>
  );
}
