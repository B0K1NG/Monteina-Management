import React from 'react';
import Dropdown from '../../components/Dropdown';
import { Service } from '../types';
import { tireQuantity } from '../utils/constants';

interface Props {
  services: Service[];
  selectedService: string;
  onServiceChange(v: string): void;
  tireQuantityVal: string;
  onQuantityChange(v: string): void;
  repairOption: string | null;
  onRepairChange(v: string): void;
  valveChange: boolean;
  onValveChange(v: boolean): void;
}

const ServiceOptionsForm: React.FC<Props> = ({
  services,
  selectedService,
  onServiceChange,
  tireQuantityVal,
  onQuantityChange,
  repairOption,
  onRepairChange,
  valveChange,
  onValveChange
}) => (
  <div className="service-options">
    <div className="top-options">
      <div className="service-options-choice">
        <Dropdown
          options={services.map(s => ({ value: s.name, label: s.name }))}
          value={selectedService}
          onChange={onServiceChange}
          placeholder="Pasirinkite paslaugą"
          className="dropdown-service"
        />
      </div>
      <div className="service-tire-quantity">
        <Dropdown
          options={tireQuantity.map(q => ({ value: q, label: q }))}
          value={tireQuantityVal}
          onChange={onQuantityChange}
          placeholder="Ratų kiekis"
          className="dropdown-tire-quantity"
        />
      </div>
    </div>

    <div className="bottom-options">
      {selectedService === 'Padangos remontas' && (
        <div className="repair-options">
          <Dropdown
            options={[
              { value: 'ventiliu-keitimas', label: 'Ventilių keitimas' },
              { value: 'siulo-iverimas', label: 'Siūlo įvėrimas' },
              { value: 'lopas', label: 'Lopo dėjimas' },
            ]}
            value={repairOption || ''}
            onChange={onRepairChange}
            placeholder="Remonto tipas"
            className="dropdown-repair"
          />
        </div>
      )}
      <div className="service-valves-optional">
        <label>
          Ventilių keitimas
          <input
            type="checkbox"
            checked={valveChange}
            onChange={e => onValveChange(e.target.checked)}
          />
        </label>
      </div>
    </div>
  </div>
);

export default ServiceOptionsForm;