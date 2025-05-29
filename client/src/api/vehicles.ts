import axios from 'axios';

const BASE_URL = `${(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '')}/api/carquery`;

export const getAllMakes = async () => {
    const response = await axios.get(`${BASE_URL}?callback=?&cmd=getMakes&sold_in_us=1`);
    const data = response.data as { Makes: any[] };
    return data.Makes.map((make: any) => ({
        make_id: make.make_id,
        make_display: make.make_display,
    }));
};

export const getModelsForMake = async (make: string) => {
    const response = await axios.get(`${BASE_URL}?callback=?&cmd=getModels&make=${make}&sold_in_us=1`);
    const data = response.data as { Models?: any[] };
    if (
        !data ||
        typeof data !== 'object' ||
        !Array.isArray(data.Models)
    ) {
        throw new Error('Invalid response format: "Models" is not an array');
    }

    return data.Models.map((model: any) => ({
        model_name: model.model_name,
        model_make_id: model.model_make_id,
    }));
};