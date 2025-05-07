import React from 'react';

interface Props {
  time: string;
  date: string;
  serviceName: string;
  mainSvc: number;
  repairOption?: string;
  valvePrice: number;
  advance: number;
  total: number;
  remaining: number;
  serviceId: string;
  onPay(): void;
}

const CheckoutSummary: React.FC<Props> = ({
  time, date, serviceName, mainSvc, repairOption, valvePrice,
  advance, total, remaining, serviceId, onPay
}) => (
  <div className="checkout-summary">
    <div className="checkout-date"><span>{time}</span><span>{date}</span></div>
    <hr className="separation-line"/>
    <h2 className="checkout-subheader">Santrauka</h2>

    <div className="summary-item"><span>Užsakymo numeris</span><span>{serviceId}</span></div>
    <div className="summary-item"><span>{serviceName}</span><span>{mainSvc} €</span></div>
    {repairOption && (
      <div className="summary-item">
        <span>Remonto tipas</span>
        <span>{
          repairOption === 'ventiliu-keitimas' ? 'Ventilių keitimas'
          : repairOption === 'siulo-iverimas'  ? 'Siūlo įvėrimą'
                                              : 'Lopo dėjimas'
        }</span>
      </div>
    )}
    {valvePrice > 0 && (
      <div className="summary-item"><span>Ventilių keitimo kaina</span><span>{valvePrice} €</span></div>
    )}
    <hr className="separation-line"/>
    <div className="summary-item"><span>Užsakymo suma</span><span>{total} €</span></div>
    <div className="summary-item"><span>Avansas</span><span>{advance} €</span></div>
    <div className="summary-item"><span>Likusi suma po avanso</span><span>{remaining} €</span></div>
    <hr className="separation-line"/>
    <button className="pay-button" onClick={onPay}>Apmokėti</button>
    <div className="checkout-terms">
      <p>
        Paspaudę "Apmokėti" sutinkate su mūsų <a href="/terms">paslaugų teikimo sąlygomis.</a>
      </p>
      <p>Automobiliai kurių varžtų nebus įmanoma atsukti nebus aptarnaujami</p>
      <p>Jei nepavyks atvykti pasirinktu laiku, jūs būsite įrašyti į gyvąją eilę.</p>
    </div>
  </div>
);

export default CheckoutSummary;