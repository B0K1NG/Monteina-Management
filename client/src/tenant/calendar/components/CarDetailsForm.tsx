import React from 'react';
import Dropdown from '../../../components/Dropdown';
import { CarDetails } from '../types';
import { tireSizes } from '../utils/constants';

interface Props {
  carDetails: CarDetails;
  makes: string[];
  models: Record<string,string[]>;
  fetchModels(make: string): void;
  onChange(field: keyof CarDetails, value: string): void;
}

const CarDetailsForm: React.FC<Props> = ({
  carDetails,
  makes,
  models,
  fetchModels,
  onChange
}) => (
  <div className="car-service-box-information">
    <Dropdown
      options={makes.map(m => ({ value: m, label: m }))}
      value={carDetails.make}
      onChange={v => {
        onChange('make', v);
        fetchModels(v);
      }}
      placeholder="Gamintojas"
      className="dropdown-make"
      searchable
    />
    <Dropdown
      options={(models[carDetails.make] || []).map(m => ({
        value: m,
        label: m
      }))}
      value={carDetails.model}
      onChange={v => onChange('model', v)}
      placeholder="Modelis"
      className="dropdown-model"
      disabled={!carDetails.make}
      searchable
    />
    <Dropdown
      options={Array.from({ length: 30 }, (_, i) => {
        const y = new Date().getFullYear() - i;
        return { value: String(y), label: String(y) };
      })}
      value={carDetails.year}
      onChange={v => onChange('year', v)}
      placeholder="Pagaminimo metai"
      className="dropdown-year"
    />
    <Dropdown
      options={tireSizes.map(sz => ({ value: sz, label: sz }))}
      value={carDetails.tireSize}
      onChange={v => onChange('tireSize', v)}
      placeholder="Ratų išmatavimai"
      className="dropdown-tire-size"
    />
  </div>
);

export default CarDetailsForm;