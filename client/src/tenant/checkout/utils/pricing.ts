import { BookingDetails } from '../types';

export function calculateAmounts(details: BookingDetails) {
  const { selectedService, tireQuantity, repairOption, valveChange, carDetails } = details;

  const mainSvc = selectedService.name === 'Padangos remontas'
    ? (repairOption === 'lopas'
        ? selectedService.price_max
        : selectedService.price_min)
    : (carDetails.tireSize.startsWith('R16')
        ? selectedService.price_max
        : selectedService.price_min);

  const groupRepairCount = repairOption ? Math.ceil(tireQuantity / 4) : tireQuantity;
  const valvePrice = valveChange ? 5 : 0;
  const advanceAmount = 5;
  const totalAmount = repairOption
    ? mainSvc * groupRepairCount + valvePrice
    : mainSvc * tireQuantity + valvePrice;
  const remaining = totalAmount - advanceAmount;
  const serviceId = `MONT${new Date().toISOString().slice(0,10).replace(/-/g,'')}-001`;

  return { mainSvc, valvePrice, advanceAmount, totalAmount, remaining, serviceId };
}