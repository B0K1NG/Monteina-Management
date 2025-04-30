interface Props {
  activeAndDoneCount: number;
  filteredCount: number;
  totalAmount: string;
  averagePrice: string;
  popularService: string;
  closestReservation: string;
}

export default function SummaryBoxes({
  activeAndDoneCount,
  filteredCount,
  totalAmount,
  averagePrice,
  popularService,
  closestReservation,
}: Props) {
  return (
    <div className="dashboard-boxes">
      <div className="box">
        <h2>{activeAndDoneCount}</h2>
        <p>Rezervacijų (aktyvios+baigtos)</p>
        <p>Skaičius: {filteredCount}</p>
        <p>Artimiausia rezervacija: {closestReservation}</p>
      </div>

      <div className="box">
        <h2>{totalAmount} €</h2>
        <p>Pajamos</p>
        <p>Vid. kaina: {averagePrice} €</p>
      </div>

      <div className="box">
        <h2>Populiariausia paslauga</h2>
        <p>{popularService}</p>
      </div>
    </div>
  );
}