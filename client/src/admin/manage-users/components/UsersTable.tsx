import { User } from '../types';
import { translateRole, translateStatus } from '../utils/translate';

interface Props {
  users: User[];
  onEdit(user: User): void;
}

export default function UsersTable({ users, onEdit }: Props) {
  return (
    <table className="users-table">
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
            <td>{u.phoneNumber}</td>
            <td>{translateStatus[u.status]}</td>
            <td>{translateRole[u.role]}</td>
            <td>
              <img
                src="/src/assets/icons/edit.png"
                alt="Edit"
                className="action-icon"
                onClick={() => onEdit(u)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
