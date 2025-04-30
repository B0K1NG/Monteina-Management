import { Booking } from '../types';

interface Props {
  bookings: Booking[];
  onEdit(b: Booking): void;
}

export default function OrdersTable({ bookings, onEdit }: Props) {
  const labels = { active:'Aktyvus', done:'Baigtas', canceled:'Atšauktas' };
  if (!bookings.length) return <div>Nėra užsakymų</div>;
  return (
    <table className="orders-table">
      <thead>
        <tr>
          <th>Data</th><th>Laikas</th><th>Klientas</th>
          <th>Paslauga</th><th>Statusas</th><th>Veiksmai</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map(b=>(
          <tr key={b.id}>
            <td>{b.bookingDate}</td>
            <td>{b.bookingTime}</td>
            <td>{b.userName}</td>
            <td>{b.serviceName}</td>
            <td>{labels[b.status]||b.status}</td>
            <td><button onClick={()=>onEdit(b)}>Edit</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
