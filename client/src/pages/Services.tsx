import React from 'react';
import useServices from '../tenant/services/hooks/useServices';
import useBookingNavigate from '../tenant/services//hooks/useBookingNavigate';
import ServicesGrid from '../tenant/services/components/ServicesGrid';

const ServicesPage: React.FC = () => {
  const { services, loading, error } = useServices();
  const book = useBookingNavigate();

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Failed to load services</p>;

  return (
    <div className="services-page">
      <h1 className="services-title">Paslaugos</h1>
      <ServicesGrid services={services} onBook={book} />
    </div>
  );
};

export default ServicesPage;