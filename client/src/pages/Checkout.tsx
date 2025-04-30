import useBookingDetails from '../checkout/hooks/useBookingDetails';
import { calculateAmounts } from '../checkout/utils/pricing';
import usePayment from '../checkout/hooks/usePayment';
import CheckoutDetails from '../checkout/components/CheckoutDetails';
import CheckoutSummary from '../checkout/components/CheckoutSummary';

export default function CheckoutPage() {
  const details = useBookingDetails();
  if (!details) return null;

  const {
    mainSvc, valvePrice, advanceAmount,
    totalAmount, remaining, serviceId
  } = calculateAmounts(details);

  const pay = usePayment();

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