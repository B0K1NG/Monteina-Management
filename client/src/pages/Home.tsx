import React from 'react';
import Header from '../home/components/Header';
import Steps from '../home/components/Steps';
import useAuthNavigate from '../home/hooks/useAuthNavigate';

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