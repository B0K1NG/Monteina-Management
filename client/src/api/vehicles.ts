import axios from 'axios';

const BASE_URL = 'https://vpic.nhtsa.dot.gov/api';

export const getAllMakes = async () => {
    const response = await axios.get(`${BASE_URL}/vehicles/getallmakes?format=json`);
    return response.data.Results;
};

export const getModelsForMake = async (make: string) => {
    const response = await axios.get(`${BASE_URL}/vehicles/getmodelsformake/${make}?format=json`);
    return response.data.Results;
};