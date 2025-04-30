import { Service } from '../types';
import editIcon from '../../../assets/icons/edit.png';
import trashIcon from '../../../assets/icons/trash.png';

interface Props {
  services: Service[];
  onEdit(s: Service): void;
  onDelete(s: Service): void;
}

export default function ServicesTable({ services, onEdit, onDelete }: Props) {
  return (
    <div className="orders-table">
      <table>
        <thead>
          <tr>
            <th>Pavadinimas</th>
            <th>Aprašymas</th>
            <th>Kaina</th>
            <th>Statusas</th>
            <th>Veiksmai</th>
          </tr>
        </thead>
        <tbody>
          {services.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.description}</td>
              <td>{s.price_min} - {s.price_max} €</td>
              <td>{s.status === 'active' ? 'Aktyvi' : 'Išjungta'}</td>
              <td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
