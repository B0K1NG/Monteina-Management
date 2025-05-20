import React from 'react';
import { Service } from '../types';

interface Props {
  service: Service;
  index: number;
  onBook: () => void;
}

const icons = [
  '/assets/icons/tire_install_icon.png',
  '/assets/icons/balancing_icon.png',
  '/assets/icons/flat_tire_icon.png',
  '/assets/icons/rim_icon.png',
  '/assets/icons/tires__icon.png',
  '/assets/icons/tire_icon.png',
];

const ServiceCard: React.FC<Props> = ({ service, index, onBook }) => (
  <div className="service-card">
    <img
      src={icons[index % icons.length]}
      alt={service.name}
      className="service-icon"
    />
    <h2 className="service-name">{service.name}</h2>
    <p className="service-description">{service.description}</p>
    <p className="service-price">
      {service.price_min} - {service.price_max} €
    </p>
    <button onClick={onBook} className="service-button">
      <span className="button-text">Rezervuoti laiką</span>{' '}
      <span className="arrow-right">→</span>
    </button>
  </div>
);

export default ServiceCard;