import { User } from '../types';
import { translateRole, translateStatus } from '../utils/translate';

interface Props {
  users: User[];
  onEdit(user: User): void;
}

export default function UsersTable({ users, onEdit }: Props) {
  return (
    <div className='users-table'>
    <table>
      <thead>
        <tr>
          <th>Vardas</th>
          <th>El. Paštas</th>
          <th>Tel. Nr.</th>
          <th>Paskyros Statusas</th>
          <th>Rolė</th>
          <th>Veiksmai</th>
        </tr>
      </thead>
      <tbody>
        {users.map(u => (
          <tr key={u.id}>
            <td>{`${u.firstName} ${u.lastName.charAt(0)}.`}</td>
            <td>{u.email}</td>
            <td className="phone-number">{u.phoneNumber}</td>
            <td className={`status status--${u.status}`}>{translateStatus[u.status]}</td>
            <td>{translateRole[u.role]}</td>
            <td>
              <img
                src="/assets/icons/edit.png"
                alt="Edit"
                className="action-icon"
                onClick={() => onEdit(u)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}
