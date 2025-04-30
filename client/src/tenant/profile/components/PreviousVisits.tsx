import { Visit } from '../types';
import { formatISODate } from '../utils/formatDate';

interface Props {
  visits: Visit[];
  onViewInvoice(v: Visit): void;
}

export default function PreviousVisits({ visits, onViewInvoice }: Props) {
  return (
    <div className="profile-center panel">
      <h2 className="section-title">Senos sąskaitos</h2>
      {visits.length > 0 && (
        <div className="visit-item visit-item--header">
          <div className="visit-item__date">Data</div>
          <div className="visit-item__total">Suma</div>
          <div className="visit-item__btn" />
        </div>
      )}
      {visits.length > 0 ? (
        visits.map((v, i) => (
          <div key={i} className="visit-item">
            <div className="visit-item__date">{formatISODate(v.bookingDate)}</div>
            <div className="visit-item__total">{v.totalAmount} €</div>
            <button
              className="btn btn--secondary visit-item__btn"
              onClick={() => onViewInvoice(v)}
            >
              Peržiūrėti
            </button>
          </div>
        ))
      ) : (
        <p>Nėra ankstesnių sąskaitų.</p>
      )}
    </div>
  );
}
