import React from 'react';
import ServiceCard from './ServiceCard';
import { Service } from '../types';

interface Props {
  services: Service[];
  onBook: () => void;
}

const ServicesGrid: React.FC<Props> = ({ services, onBook }) => (
  <div className="services-grid">
    {services.map((svc, i) => (
      <ServiceCard
        key={svc.id}
        service={svc}
        index={i}
        onBook={onBook}
      />
    ))}
  </div>
);

export default ServicesGrid;