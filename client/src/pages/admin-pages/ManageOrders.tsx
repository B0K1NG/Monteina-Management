import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { createOrder } from '../../api/booking';

import { useUsers } from '../../admin/manage-orders/hooks/useUsers';
import { useServices } from '../../admin/manage-orders/hooks/useServices';
import { useCarMakesModels } from '../../admin/manage-orders/hooks/useCarMakesModels';
import { useBookingsAdmin } from '../../admin/manage-orders/hooks/useBookingsAdmin';

import OrdersFilters from '../../admin/manage-orders/components/OrderFilters';
import OrdersTable from '../../admin/manage-orders/components/OrdersTable';
import AddOrderModal from '../../admin/manage-orders/components/AddOrderModal';
import EditOrderModal from '../../admin/manage-orders/components/EditOrderModal';
import CancelOrderModal from '../../admin/manage-orders/components/CancelOrderModal';
import ConfirmChangesModal from '../../admin/manage-orders/components/ConfirmChangesModal';

import {
  Booking,
  OrderFormData,
  CreateOrderData,
} from '../../admin/manage-orders/types';

export default function ManageOrdersPage() {
  const users    = useUsers();
  const services = useServices();
  const { makes, models, fetchModels } = useCarMakesModels();
  const { bookings, refresh }          = useBookingsAdmin();

  const [filters, setFilters] = useState({
    user:    '',
    date:    '',
    service: '',
    status:  ''
  });

  const [showAdd,       setShowAdd]       = useState(false);
  const [editBooking,   setEditBooking]   = useState<Booking|null>(null);
  const [cancelBooking, setCancelBooking] = useState<Booking|null>(null);
  const [confirmBooking,setConfirmBooking]= useState<Booking|null>(null);

  const filtered = useMemo(() => bookings.filter(b => {

    const userMatch = !filters.user ||
      b.userName ===
        `${users.find(u=>u.id===filters.user)?.firstName} ${users.find(u=>u.id===filters.user)?.lastName}`;
    const dateMatch    = !filters.date    || b.bookingDate === filters.date;
    const serviceMatch = !filters.service || b.serviceName === filters.service;
    const statusMatch  = !filters.status  || b.status === filters.status;
    return userMatch && dateMatch && serviceMatch && statusMatch;
  }), [bookings, filters, users]);

  const handleAdd = async (form: OrderFormData) => {

    const svc = services.find(s => s.id === form.serviceId);
    if (!svc) {
      toast.error('Paslauga nerasta');
      return;
    }

    const advanceAmount = 0;

    let mainPrice = svc.price_min ?? 0;
    if (svc.name === 'Padangos remontas' && form.repairOption === 'lopas' && svc.price_max != null) {
      mainPrice = svc.price_max;
    }

    const valvePrice = form.valveChange ? 5 : 0;
    const totalAmount     = mainPrice * form.tireQuantity + valvePrice;
    const remainingAmount = totalAmount - advanceAmount;

    const payload: CreateOrderData = {
      ...form,
      paymentStatus: 'success',
      selectedService: {
        name:      svc.name,
        price_min: svc.price_min ?? 0,
        price_max: svc.price_max ?? undefined
      },
      advanceAmount,
      totalAmount,
      remainingAmount
    };

    try {
      await createOrder(payload);
      toast.success('Užsakymas pridėtas');
      refresh();
      setShowAdd(false);
    } catch {
      toast.error('Nepavyko pridėti užsakymo');
    }
  };

  const handleSave = async (b: Booking) => {
    try {
      await axios.patch(`/api/checkout/${b.id}`, b);
      toast.success('Pakeitimai sėkmingai patvirtinti');
      refresh();
      setConfirmBooking(null);
      setEditBooking(null);
    } catch {
      toast.error('Nepavyko atnaujinti užsakymo');
    }
  };

  const handleCancel = async (b: Booking) => {
    try {
      await axios.patch(`/api/checkout/${b.id}`, { status:'canceled' });
      toast.success('Užsakymas atšauktas');
      refresh();
      setCancelBooking(null);
    } catch {
      toast.error('Nepavyko atšaukti užsakymo');
    }
  };

  return (
    <div className="manage-orders-container">
      <h1>Užsakymų valdymas</h1>
      <button onClick={() => setShowAdd(true)}>+ Pridėti užsakymą</button>

      <OrdersFilters
        users={users}
        services={services}
        filters={filters}
        onFilterChange={(field, v) =>
          setFilters(fs => ({ ...fs, [field]: v }))
        }
      />

      <OrdersTable
        bookings={filtered}
        onEdit={b => setEditBooking(b)}
      />

      <AddOrderModal
        isOpen={showAdd}
        users={users}
        services={services}
        makes={makes}
        models={models}
        fetchModels={fetchModels}
        onCancel={() => setShowAdd(false)}
        onSave={handleAdd}
      />

      {editBooking && (
        <EditOrderModal
          booking={editBooking}
          onCancel={() => setEditBooking(null)}
          onSave={b => setConfirmBooking(b)}
        />
      )}

      {cancelBooking && (
        <CancelOrderModal
          booking={cancelBooking}
          onClose={() => setCancelBooking(null)}
          onConfirm={() => handleCancel(cancelBooking)}
        />
      )}

      {confirmBooking && (
        <ConfirmChangesModal
          booking={confirmBooking}
          onClose={() => setConfirmBooking(null)}
          onConfirm={() => handleSave(confirmBooking)}
        />
      )}
    </div>
  );
}
