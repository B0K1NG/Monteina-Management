import React, { useState, useRef, useEffect } from 'react';
import '../styles/components/_dropdown.scss';

interface DropdownProps {
  options: { value: string; label: string }[];
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

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm(''); // Clear search term when an option is selected
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
      </div>
      {isOpen && !disabled && (
  <div className="dropdown-list-wrapper">
    <ul className="dropdown-list">
      {searchable && ( // Conditionally render the search input
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
          className={`dropdown-item ${option.value === value ? 'selected' : ''}`}
          onClick={() => handleOptionClick(option.value)}
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