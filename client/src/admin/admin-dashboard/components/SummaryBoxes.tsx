import reservationIcon from "../../../assets/icons/clock_icon.png"
import incomeIcon from "../../../assets/icons/stocks_icon.png"
import popularServiceIcon from "../../../assets/icons/hammer_icon.png"

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
  totalAmount,
  averagePrice,
  popularService,
  closestReservation,
}: Props) {
  return (
    <div className="dashboard-boxes">
      <div className="box">
        <h2>Rezervacijų skaičius</h2>
        <h3>{activeAndDoneCount}</h3>

        <p><img src={reservationIcon} alt="Artimiausios rezervacijos ikona" />Artimiausia rezervacija: {closestReservation}</p>
      </div>

      <div className="box">
        <h2>Pajamos</h2>
        <h3>{totalAmount} €</h3>

        <p><img src={incomeIcon} alt="Artimiausios rezervacijos ikona" />Vidutinė paslaugos kaina: {averagePrice} €</p>
      </div>

      <div className="box">
        <h2>Populiariausia paslauga</h2>
        <p><img src={popularServiceIcon} alt="Artimiausios rezervacijos ikona" />{popularService}</p>
      </div>
    </div>
  );
}