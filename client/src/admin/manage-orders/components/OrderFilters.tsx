import Dropdown from '../../../components/Dropdown';
import { User, Service } from '../types';

interface Props {
  users: User[];
  services: Service[];
  filters: {
    user: string;
    date: string;
    service: string;
    status: string;
  };
  onFilterChange(
    field: 'user' | 'date' | 'service' | 'status',
    value: string
  ): void;
}

export default function OrdersFilters({
  users,
  services,
  filters,
  onFilterChange,
}: Props) {
  const dateOptions = [
    { value: '', label: 'Visos datos' },
    ...Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      return { value: iso, label: iso };
    }),
  ];

  return (
    <div className="filters">
      <Dropdown
        options={[
          { value: '', label: 'Visi klientai' },
          ...users.map(u => ({
            value: u.id,
            label: `${u.firstName} ${u.lastName}`,
          })),
        ]}
        value={filters.user}
        onChange={v => onFilterChange('user', v)}
        placeholder="Pasirinkite klientą"
      />

      <Dropdown
        options={dateOptions}
        value={filters.date}
        onChange={v => onFilterChange('date', v)}
        placeholder="Pasirinkite datą"
      />

      <Dropdown
        options={[
          { value: '', label: 'Visos paslaugos' },
          ...services.map(s => ({ value: s.name, label: s.name })),
        ]}
        value={filters.service}
        onChange={v => onFilterChange('service', v)}
        placeholder="Pasirinkite paslaugą"
      />

      <Dropdown
        options={[
          { value: '', label: 'Visi statusai' },
          { value: 'active', label: 'Aktyvus' },
          { value: 'done', label: 'Baigtas' },
          { value: 'canceled', label: 'Atšauktas' },
        ]}
        value={filters.status}
        onChange={v => onFilterChange('status', v)}
        placeholder="Pasirinkite statusą"
      />
    </div>
  );
}
