import React, { useState, useEffect } from 'react';
import { Service } from '../types';

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

  useEffect(() => {
    if (service) {
      setName(service.name);
      setDescription(service.description);
      setPriceMin(service.price_min);
      setPriceMax(service.price_max);
    } else {
      setName('');
      setDescription('');
      setPriceMin('');
      setPriceMax('');
    }
  }, [service, isOpen]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      description,
      price_min: Number(priceMin),
      price_max: Number(priceMax),
      status: service?.status ?? 'active',
    });
  };

  if (!isOpen) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{service ? 'Paslaugos redagavimas' : 'Paslaugos pridėjimas'}</h2>
        <form onSubmit={submit}>
          <label>Paslaugos pavadinimas</label>
          <input value={name} onChange={e => setName(e.target.value)} />

          <label>Aprašymas</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} />

          <label>Kaina (žemiausia)</label>
          <input
            type="number"
            value={priceMin}
            onChange={e => setPriceMin(e.target.value === '' ? '' : Number(e.target.value))}
          />

          <label>Kaina (aukščiausia)</label>
          <input
            type="number"
            value={priceMax}
            onChange={e => setPriceMax(e.target.value === '' ? '' : Number(e.target.value))}
          />

          <div className="modal-buttons">
            <button type="button" onClick={onCancel}>Atšaukti</button>
            <button type="submit">Išsaugoti</button>
          </div>
        </form>
      </div>
    </div>
  );
}
