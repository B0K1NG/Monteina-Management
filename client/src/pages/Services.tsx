import { useEffect, useState } from 'react';
import axios from '../api/axios';
import '../styles/clientPages/_services.scss';
import { useNavigate } from 'react-router-dom';

export default function Services() {
  interface Service {
    id: number;
    name: string;
    description: string;
    price_min: number;
    price_max: number;
  }

  const [services, setServices] = useState<Service[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/services');
        setServices(response.data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };

    fetchServices();
  }, []);

  const handleBookingClick = () => {
    const isAuthenticated = !!localStorage.getItem('token');
    if (isAuthenticated) {
      navigate('/calendar');
    } else {
      navigate('/login');
    };
  };

  return (
    <div className="services-page">
      <h1 className="services-title">Paslaugos</h1>
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={service.id} className="service-card">
            <img 
              src={[
                '/src/assets/icons/tire_install_icon.png',
                '/src/assets/icons/balancing_icon.png',
                '/src/assets/icons/flat_tire_icon.png',
                '/src/assets/icons/rim_icon.png',
                '/src/assets/icons/tires__icon.png',
                '/src/assets/icons/tire_icon.png'
              ][index % 6]} 
              alt={service.name} 
              className="service-icon"
            />
            <h2 className="service-name">{service.name}</h2>
            <p className="service-description">{service.description}</p>
            <p className="service-price">
              {service.price_min} - {service.price_max} €
            </p>
            <button onClick={handleBookingClick} className='service-button'>
              <span className="button-text">Rezervuoti laiką</span> <span className="arrow-right">→</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}