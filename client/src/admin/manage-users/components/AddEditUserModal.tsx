import { useState, useEffect } from 'react';
import { UserFormData, User } from '../types';

interface Props {
  isOpen: boolean;
  user?: User;
  onCancel(): void;
  onSave(data: UserFormData): Promise<void>;
}

export default function AddEditUserModal({ isOpen, user, onCancel, onSave }: Props) {
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
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{user ? 'Redaguoti Vartotoją' : 'Pridėti Vartotoją'}</h2>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
          <input
            type="text"
            name="firstName"
            placeholder="Vardas"
            value={form.firstName}
            onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Pavardė"
            value={form.lastName}
            onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
          />
          <input
            type="email"
            name="email"
            placeholder="El. Paštas"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Tel. Nr."
            value={form.phoneNumber}
            onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
          />
          {!user && (
            <input
              type="password"
              name="password"
              placeholder="Slaptažodis"
              value={form.password || ''}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
          )}
          <select
            name="role"
            value={form.role}
            onChange={e => setForm(f => ({ ...f, role: e.target.value as any }))}
          >
            <option value="client">Vartotojas</option>
            <option value="admin">Administratorius</option>
          </select>
          <select
            name="status"
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
          >
            <option value="active">Aktyvus</option>
            <option value="blocked">Užblokuotas</option>
            <option value="not_confirmed">Nepatvirtintas</option>
          </select>
          <div className="modal-actions">
            <button type="submit">{user ? 'Atnaujinti' : 'Patvirtinti'}</button>
            <button type="button" onClick={onCancel}>Uždaryti</button>
          </div>
        </form>
      </div>
    </div>
  );
}
