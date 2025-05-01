import Dropdown from '../../../components/Dropdown';
import { UserFilters } from '../types';
import searchIcon from '../../../assets/icons/search_interface_symbol.png';

interface Props {
  filters: UserFilters;
  onChange(field: keyof UserFilters, value: string): void;
}

export default function UsersFilters({ filters, onChange }: Props) {
  return (
    <div className="manage-users-actions">

        <input
          type="text"
          placeholder="Ieškoti vartotojo"
          value={filters.search}
          onChange={e => onChange('search', e.target.value)}
          style={{
            backgroundImage: `url(${searchIcon})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'left .75rem center',
            backgroundSize: '20px 20px',
          }}
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
    </div>
  );
}
