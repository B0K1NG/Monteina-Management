import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';

export default function ManageUsers() {
  interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    status: string;
    role: string;
    password?: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setEditUserModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'client',
    status: 'active',
    password: '',
  });

  useEffect(() => {
    axios.get('/api/users')
      .then(response => {
        console.log('Fetched users:', response.data);
        setUsers(response.data);
      })
      .catch(error => console.error('Failed to fetch users:', error));
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm);

    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesStatus = statusFilter ? user.status === statusFilter : true;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const translateStatus = {
    active: 'Aktyvus',
    blocked: 'Užblokuotas',
    not_confirmed: 'Nepatvirtintas',
  };

  const translateRole = {
    client: 'Vartotojas',
    admin: 'Administratorius',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleConfirm = () => {
    if (!userData.firstName || !userData.lastName || !userData.email || !userData.phoneNumber || !userData.role) {
      toast.error('Prašome užpildyti visus laukus!');
      return;
    }

    const emailExists = users.some(user => user.email === userData.email);
    if (emailExists) {
      toast.error('Vartotojas su tokiu el. paštu jau egzistuoja!');
      return;
    }

    axios.post('/api/users', userData)
      .then(() => {
        setAddUserModalOpen(false);
        setUsers([...users, { ...userData, id: String(users.length + 1) }]);
        clearFields();
        toast.success('Naujas vartotojas pridėtas sėkmingai!');
      })
      .catch(error => console.error('Failed to add user:', error));
  };

  const handleEditUser = (user: User) => {
    setUserData({ ...user, password: user.password || '' });
    setEditUserModalOpen(true);
  };

  const handleConfirmEdit = () => {
    setEditUserModalOpen(false);
    handleConfirmUpdate();
  };

  const handleConfirmUpdate = () => {
    axios.put(`/api/users/${userData.id}`, userData)
      .then(() => {
        setUsers(users.map(u => (u.id === userData.id ? userData : u)));
        clearFields();
        toast.success('Vartotojas atnaujintas sėkmingai!');
      })
      .catch(error => {
        console.error('Failed to update user:', error);
        toast.error('Nepavyko atnaujinti vartotojo!');
      });
  };

  const clearFields = () => {
    setUserData({
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: 'client',
      status: 'active',
      password: '',
    });
  };

  const closeModal = () => {
    setAddUserModalOpen(false);
    clearFields();
  };

  return (
    <div className="manage-users-container">
      <h1 className="manage-users-title">Vartotojų valdymas</h1>
      <div className="manage-users-actions">
        <input
          type="text"
          placeholder="Ieškoti vartotojo"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
        >
          <option value="">Visos Rolės</option>
          <option value="client">Vartotojas</option>
          <option value="admin">Administratorius</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">Visi Statusai</option>
          <option value="active">Aktyvus</option>
          <option value="blocked">Užblokuotas</option>
          <option value="not_confirmed">Nepatvirtintas</option>
        </select>
        <button className="btn" onClick={() => setAddUserModalOpen(true)}>+ Pridėti vartotoją</button>
      </div>
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
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{`${user.firstName} ${user.lastName.charAt(0)}.`}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>{translateStatus[user.status as keyof typeof translateStatus]}</td>
              <td>{translateRole[user.role as keyof typeof translateRole]}</td>
              <td>
                <img
                  src="/src/assets/icons/edit.png"
                  alt="Edit"
                  className="action-icon"
                  style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                  onClick={() => handleEditUser(user)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isAddUserModalOpen && (
        <div className="modal">
          <h2>{userData.id ? 'Koreguoti Vartotoją' : 'Pridėti Vartotoją'}</h2>
          <form>
            <input
              type="text"
              name="firstName"
              placeholder="Vardas"
              value={userData.firstName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Pavardė"
              value={userData.lastName}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="El. Paštas"
              value={userData.email}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Tel. Nr."
              value={userData.phoneNumber}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Slaptažodis"
              value={userData.password}
              onChange={handleChange}
            />
            <select name="role" value={userData.role} onChange={handleChange}>
              <option value="client">Vartotojas</option>
              <option value="admin">Administratorius</option>
            </select>
            <select name="status" value={userData.status} onChange={handleChange}>
              <option value="active">Aktyvus</option>
              <option value="blocked">Užblokuotas</option>
              <option value="not_confirmed">Nepatvirtintas</option>
            </select>
          </form>
          <div className="modal-actions">
            <button onClick={userData.id ? handleConfirmUpdate : handleConfirm}>
              {userData.id ? 'Atnaujinti' : 'Patvirtinti'}
            </button>
            <button onClick={closeModal}>Grįžti</button>
          </div>
        </div>
      )}
      {isEditUserModalOpen && (
        <div className="modal">
          <h2>Koreguoti Vartotoją</h2>
          <form>
            <input
              type="text"
              name="firstName"
              placeholder="Vardas"
              value={userData.firstName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Pavardė"
              value={userData.lastName}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="El. Paštas"
              value={userData.email}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Tel. Nr."
              value={userData.phoneNumber}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Slaptažodis"
              value={userData.password}
              onChange={handleChange}
            />
            <select name="role" value={userData.role} onChange={handleChange}>
              <option value="client">Vartotojas</option>
              <option value="admin">Administratorius</option>
            </select>
            <select name="status" value={userData.status} onChange={handleChange}>
              <option value="active">Aktyvus</option>
              <option value="blocked">Užblokuotas</option>
              <option value="not_confirmed">Nepatvirtintas</option>
            </select>
          </form>
          <div className="modal-actions">
            <button onClick={handleConfirmEdit}>Patvirtinti</button>
            <button onClick={() => setEditUserModalOpen(false)}>Grįžti</button>
          </div>
        </div>
      )}
    </div>
  );
}