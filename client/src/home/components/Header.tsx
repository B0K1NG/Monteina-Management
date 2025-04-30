import React from 'react';
import HomeButtons from './HomeButtons';

interface Props {
  onBookingClick: () => void;
  onMoreClick: () => void;
}

const Header: React.FC<Props> = ({ onBookingClick, onMoreClick }) => (
  <header className="home-header">
    <h1 className="home-title">MONTEINA</h1>
    <p className="home-subtitle">Kur tikslumas susitinka su patikimumu</p>
    <HomeButtons onBookingClick={onBookingClick} onMoreClick={onMoreClick} />
  </header>
);

export default Header;