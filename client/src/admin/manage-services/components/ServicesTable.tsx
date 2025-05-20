import { Service } from '../types';
import editIcon from '/assets/icons/edit.png';
import trashIcon from '/assets/icons/trash.png';

interface Props {
  services: Service[];
  onEdit(s: Service): void;
  onDelete(s: Service): void;
}

export default function ServicesTable({ services, onEdit, onDelete }: Props) {
  return (
    <div className="services-table">
      {services.map(s => (
        <div key={s.id} className="service-item">
          <div className="service-details">
            <div className="service-name">{s.name}</div>
            <div className="service-description">{s.description}</div>
          </div>
          <div className="service-pricing">{s.price_min} - {s.price_max} €</div>
          <div className={`service-status status--${s.status}`}>{s.status === 'active' ? 'Aktyvi' : 'Išjungta'}</div>
          <div className="service-actions">
            <img
              src={editIcon}
              alt="Edit"
              className="action-icon"
              onClick={() => onEdit(s)}
            />
            <img
              src={trashIcon}
              alt="Delete"
              className="action-icon"
              onClick={() => onDelete(s)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
