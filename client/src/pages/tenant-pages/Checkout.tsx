import useBookingDetails from '../../tenant/checkout/hooks/useBookingDetails';
import { calculateAmounts } from '../../tenant/checkout/utils/pricing';
import usePayment from '../../tenant/checkout/hooks/usePayment';
import CheckoutDetails from '../../tenant/checkout/components/CheckoutDetails';
import CheckoutSummary from '../../tenant/checkout/components/CheckoutSummary';

export default function CheckoutPage() {
  const details = useBookingDetails();
  const pay = usePayment();

  if (!details) {
    return <div>Kraunasi...</div>;
  }

  const {
    mainSvc, valvePrice, advanceAmount,
    totalAmount, remaining, serviceId
  } = calculateAmounts(details);

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <CheckoutDetails
          details={details}
          onBack={() => {
            localStorage.removeItem('bookingDetails');
            window.location.href = '/calendar';
          }}
        />

        <CheckoutSummary
          time={details.time}
          date={details.date}
          serviceName={details.selectedService.name}
          mainSvc={mainSvc}
          repairOption={details.repairOption}
          valvePrice={valvePrice}
          advance={advanceAmount}
          total={totalAmount}
          remaining={remaining}
          serviceId={serviceId}
          onPay={() => pay({ ...details, serviceId, totalAmount, advanceAmount, remaining })}
        />
      </div>
    </div>
  );
}