import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import {
  useUsers
} from '../../admin/manage-users/hooks/useUsers';
import {
  addUser,
  updateUser
} from '../../admin/manage-users/hooks/useUserActions';
import UsersFilters from '../../admin/manage-users/components/UserFilters';
import UsersTable from '../../admin/manage-users/components/UsersTable';
import AddEditUserModal from '../../admin/manage-users/components/AddEditUserModal';
import { User, UserFilters, UserFormData } from '../../admin/manage-users/types';

export default function ManageUsersPage() {
  const { users, refresh } = useUsers();

  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: '',
    status: '',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User|null>(null);

  const displayed = useMemo(() =>
    users.filter(u => {
      const term = filters.search.toLowerCase();
      const okSearch =
        u.firstName.toLowerCase().includes(term) ||
        u.lastName.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.phoneNumber.includes(term);
      const okRole   = !filters.role   || u.role   === filters.role;
      const okStatus = !filters.status || u.status === filters.status;
      return okSearch && okRole && okStatus;
    }),
  [users, filters]);

  const handleSave = async (form: UserFormData) => {
    try {
      if (form.id) {
        await updateUser(form);
        toast.success('Vartotojas atnaujintas');
      } else {
        await addUser(form);
        toast.success('Vartotojas pridėtas');
      }
      setModalOpen(false);
      refresh();
    } catch {
      toast.error('Įvyko klaida');
    }
  };

  return (
    <div className="manage-users-container">
      <h1>Vartotojų valdymas</h1>

      <UsersFilters
        filters={filters}
        onChange={(f, v) => setFilters(sf => ({ ...sf, [f]: v }))}
        onAdd={() => { setEditingUser(null); setModalOpen(true); }}
      />

      <UsersTable
        users={displayed}
        onEdit={u => { setEditingUser(u); setModalOpen(true); }}
      />

      <AddEditUserModal
        isOpen={modalOpen}
        user={editingUser || undefined}
        onCancel={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}