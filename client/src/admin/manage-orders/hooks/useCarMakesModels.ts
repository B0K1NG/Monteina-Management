import { useState, useEffect } from 'react';
import { getAllMakes, getModelsForMake } from '../../../api/vehicles';

export function useCarMakesModels() {
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const fetchedMakes = await getAllMakes();
        setMakes(fetchedMakes.map((make: { make_display: string }) => make.make_display));
      } catch (error) {
        console.error('Error fetching makes:', error);
      }
    };

    fetchMakes();
  }, []);

  const fetchModels = async (make: string) => {
    try {
      const fetchedModels = await getModelsForMake(make);
      setModels((prevModels) => ({
        ...prevModels,
        [make]: fetchedModels.map((model: { model_name: string }) => model.model_name),
      }));
    } catch (error) {
      console.error(`Error fetching models for make ${make}:`, error);
    }
  };

  return { makes, models, fetchModels };
}