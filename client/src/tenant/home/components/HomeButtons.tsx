import React from 'react';

interface Props {
  onBookingClick: () => void;
  onMoreClick: () => void;
}

const HomeButtons: React.FC<Props> = ({ onBookingClick, onMoreClick }) => (
  <div className="home-buttons">
    <button onClick={onBookingClick} className="btn-primary">
      Užsakyti Paslaugą
    </button>
    <button onClick={onMoreClick} className="btn-secondary">
      Sužinoti Daugiau
    </button>
  </div>
);

export default HomeButtons;