import React from 'react';
import Header from '../../tenant/home/components/Header';
import Steps from '../../tenant/home/components/Steps';
import useAuthNavigate from '../../tenant/home/hooks/useAuthNavigate';

const HomePage: React.FC = () => {
  const authNavigate = useAuthNavigate();

  return (
    <div className="home-container">
      <Header
        onBookingClick={() => authNavigate('/calendar')}
        onMoreClick={() => authNavigate('/services')}
      />
      <Steps />
    </div>
  );
};

export default HomePage;