import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import downArrow from '../assets/icons/down_chevron.png'
import downArrowWhite from '../assets/icons/down-chevron-white.png'

interface DropdownProps {
  options: { value: string; label: string; disabled?: boolean }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  disabled = false,
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const location = useLocation();
  const isCalendarPage = location.pathname === '/calendar';

  const handleOptionClick = (optionValue: string, isDisabled: boolean) => {
    if (isDisabled) return;
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const noResultsMessage = searchTerm
    ? (options.some((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
        ? ''
        : searchTerm.toLowerCase().includes('model')
        ? 'Modelis nerastas'
        : 'Gamintojas nerastas')
    : '';

  return (
    <div className={`dropdown ${className} ${disabled ? 'dropdown-disabled' : ''}`} ref={dropdownRef}>
      <div className="dropdown-header" onClick={handleToggle}>
        {options.find((option) => option.value === value)?.label || placeholder}
        <span className="dropdown-chevron"><img src={isCalendarPage ? downArrowWhite : downArrow} alt="Rodyklė žemyn" /></span>
      </div>
      {isOpen && !disabled && (
        <div className="dropdown-list-wrapper">
          <ul className="dropdown-list">
            {searchable && (
              <li className="dropdown-item">
                <input
                  type="text"
                  className="dropdown-search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </li>
            )}
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                className={`dropdown-item ${option.value === value ? 'selected' : ''} ${option.disabled ? 'disabled' : ''}`}
                onClick={() => handleOptionClick(option.value, option.disabled || false)}
              >
                {option.label}
              </li>
            ))}
            {noResultsMessage && (
              <li className="dropdown-item no-results">{noResultsMessage}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;