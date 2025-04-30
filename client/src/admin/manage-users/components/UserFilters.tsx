import Dropdown from '../../../components/Dropdown';
import { UserFilters } from '../types';

interface Props {
  filters: UserFilters;
  onChange(field: keyof UserFilters, value: string): void;
  onAdd(): void;
}

export default function UsersFilters({ filters, onChange, onAdd }: Props) {
  return (
    <div className="manage-users-actions">
      <input
        type="text"
        placeholder="Ieškoti vartotojo"
        value={filters.search}
        onChange={e => onChange('search', e.target.value)}
      />

      <Dropdown
        value={filters.role}
        onChange={value => onChange('role', value)}
        options={[
          { value: '', label: 'Visos Rolės' },
          { value: 'client', label: 'Vartotojas' },
          { value: 'admin', label: 'Administratorius' },
        ]}
      />

      <Dropdown
        value={filters.status}
        onChange={value => onChange('status', value)}
        options={[
          { value: '', label: 'Visi Statusai' },
          { value: 'active', label: 'Aktyvus' },
          { value: 'blocked', label: 'Užblokuotas' },
          { value: 'not_confirmed', label: 'Nepatvirtintas' },
        ]}
      />

      <button className="btn" onClick={onAdd}>
        + Pridėti vartotoją
      </button>
    </div>
  );
}
