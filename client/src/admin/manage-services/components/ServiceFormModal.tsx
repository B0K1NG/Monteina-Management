import React, { useState, useEffect } from 'react';
import { Service } from '../types';
import { toast } from 'react-toastify';

interface Props {
  isOpen: boolean;
  service: Service | null;
  onCancel(): void;
  onSave(data: Omit<Service, 'id'>): void;
}

export default function ServiceFormModal({ isOpen, service, onCancel, onSave }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceMin, setPriceMin] = useState<number | ''>('');
  const [priceMax, setPriceMax] = useState<number | ''>('');
  const [status, setStatus] = useState<'active' | 'disabled'>(service?.status || 'active');

  useEffect(() => {
    if (service) {
      setName(service.name);
      setDescription(service.description);
      setPriceMin(service.price_min);
      setPriceMax(service.price_max);
      setStatus(service.status);
    } else {
      setName('');
      setDescription('');
      setPriceMin('');
      setPriceMax('');
    }
  }, [service, isOpen]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || priceMin === '' || priceMax === '') {
      toast.info('Visi laukai turi būti užpildyti!');
      return;
    }

    onSave({
      name,
      description,
      price_min: Number(priceMin),
      price_max: Number(priceMax),
      status,
    });
  };

  if (!isOpen) return null;
  return (
    <div className="service-modal">
      <div className="service-modal-content">
        <h2>{service ? 'Paslaugos Koregavimas' : 'Paslaugos Pridėjimas'}</h2>
        <form onSubmit={submit} className="service-form">
          <label>Paslaugos pavadinimas</label>
          <input value={name} onChange={e => setName(e.target.value)} className="form-input" />

          <label>Aprašymas</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="form-textarea" />

          <label>Žemiausia kaina</label>
          <input
            type="number"
            value={priceMin}
            onChange={e => {
              const value = e.target.value === '' ? '' : Math.max(0, Number(e.target.value));
              setPriceMin(value);
            }}
            className="form-input"
          />

          <label>Aukščiausia kaina</label>
          <input
            type="number"
            value={priceMax}
            onChange={e => {
              const value = e.target.value === '' ? '' : Math.max(0, Number(e.target.value));
              setPriceMax(value);
            }}
          />

          <label>Statusas</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as 'active' | 'disabled')}
            className="form-input"
          >
            <option value="active">Aktyvi</option>
            <option value="disabled">Išjungta</option>
          </select>

          <div className="modal-buttons">
            <button type="button" onClick={onCancel} className="btn btn--secondary cancel-button">Atšaukti</button>
            <button type="submit" className="btn btn--primary save-button">Išsaugoti</button>
          </div>
        </form>
      </div>
    </div>
  );
}
