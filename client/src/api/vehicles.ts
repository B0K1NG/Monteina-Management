import axios from 'axios';

const BASE_URL = `${(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '')}/api/carquery`;

export const getAllMakes = async () => {
    const response = await axios.get(`${BASE_URL}?callback=?&cmd=getMakes`);
    const data = JSON.parse((response.data as string).slice(2, -2));
    return data.Makes.map((make: any) => ({
        make_id: make.make_id,
        make_display: make.make_display,
    }));
};

export const getModelsForMake = async (make: string) => {
    const response = await axios.get(`${BASE_URL}?callback=?&cmd=getModels&make=${make}`);
    const jsonpData = (response.data as string).trim();

    if (!jsonpData.startsWith('?(') || !jsonpData.endsWith(');')) {
        throw new Error('Invalid JSONP response format');
    }

    const jsonString = jsonpData.slice(2, -2);
    const data = JSON.parse(jsonString);

    return data.Models.map((model: any) => ({
        model_name: model.model_name,
        model_make_id: model.model_make_id,
    }));
};