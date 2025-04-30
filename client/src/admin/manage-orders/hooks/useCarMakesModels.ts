import { useState, useEffect } from 'react';
import { getAllMakes, getModelsForMake } from '../../../api/vehicles';

export function useCarMakesModels() {
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<Record<string,string[]>>({});

  useEffect(() => {
    getAllMakes()
      .then(ms => setMakes(ms.map((m:any)=>m.Make_Name)))
      .catch(console.error);
  }, []);

  function fetchModels(make: string) {
    if (models[make]) return;
    getModelsForMake(make)
      .then(ms => setModels(m => ({
        ...m,
        [make]: ms.map((x:any)=>x.Model_Name)
      })))
      .catch(console.error);
  }

  return { makes, models, fetchModels };
}
