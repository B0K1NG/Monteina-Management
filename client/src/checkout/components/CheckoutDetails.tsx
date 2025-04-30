import React from 'react';
import { BookingDetails } from '../types';

interface Props {
  details: BookingDetails;
  onBack(): void;
}

const CheckoutDetails: React.FC<Props> = ({ details, onBack }) => (
  <div className="checkout-details">
    <button className="checkout-back-button" onClick={onBack}>
      Atgal
    </button>
    <h2 className="checkout-header">Užsakymo suvestinė</h2>
    <div className="detail-item">
      <span>Automobilis</span>
      <span>{details.carDetails.make} {details.carDetails.model}</span>
    </div>
    <div className="detail-item">
      <span>Ratų išmatavimai</span>
      <span>{details.carDetails.tireSize}</span>
    </div>
    <div className="detail-item">
      <span>Ratų kiekis</span>
      <span>{details.tireQuantity}</span>
    </div>
  </div>
);

export default CheckoutDetails;