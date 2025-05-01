import  { useState } from 'react';
import { toast } from 'react-toastify';
import useServicesAdmin from '../../admin/manage-services/hooks/useServicesAdmin';
import ServicesTable from '../../admin/manage-services/components/ServicesTable';
import ServiceFormModal from '../../admin/manage-services/components/ServiceFormModal';
import DeleteServiceModal from '../../admin/manage-services/components/DeleteServiceModal';
import { Service } from '../../admin/manage-services/types';

export default function ManageServicesPage() {
  const { services, addService, editService, deleteService } = useServicesAdmin();

  const [isFormOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [toDelete, setToDelete] = useState<Service | null>(null);

  const openAdd = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (s: Service) => { setEditing(s); setFormOpen(true); };

  const handleSave = async (data: Omit<Service, 'id'>) => {
    const ok = editing
      ? await editService(editing.id, data)
      : await addService(data);
    toast[ok ? 'success' : 'error'](
      editing ? 'Atnaujinta!' : 'Pridėta!'
    );
    if (ok) setFormOpen(false);
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    const ok = await deleteService(toDelete.id);
    toast[ok ? 'success' : 'error'](
      ok ? 'Ištrinta!' : 'Ištrinti nepavyko.'
    );
    if (ok) setToDelete(null);
  };

  return (
    <div className="manage-services-container">
      <h1 className="manage-services-title">Paslaugų valdymas</h1>
      <div className="manage-services-actions">
        <button className="add-service-button" onClick={openAdd}>
          + Pridėti paslaugą
        </button>
      </div>

      <ServicesTable
        services={services}
        onEdit={openEdit}
        onDelete={setToDelete}
      />

      <ServiceFormModal
        isOpen={isFormOpen}
        service={editing}
        onCancel={() => setFormOpen(false)}
        onSave={handleSave}
      />

      {toDelete && (
        <DeleteServiceModal
          service={toDelete}
          onCancel={() => setToDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
