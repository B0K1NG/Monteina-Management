import { useEffect, useState } from 'react';
import axios from '../../../api/axios';
import editIcon from '../../../assets/icons/edit.png';
import trashIcon from '../../../assets/icons/trash.png';

interface Service {
    id: number;
    name: string;
    description: string;
    price_min: number;
    price_max: number;
    status: 'active' | 'disabled';
}

export default function ManageServices() {
    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get('/api/services/admin');
                setServices(response.data);
            } catch (error) {
                console.error('Failed to fetch services:', error);
            }
        };

        fetchServices();
    }, []);

    return (
        <div className="manage-orders-container">
            <h1 className="manage-orders-title">Paslaugų valdymas</h1>
            <div className="manage-orders-actions">
                <button className="add-order-button">+ Pridėti paslaugą</button>
            </div>
            <div className="orders-table">
                <table>
                    <thead>
                        <tr>
                            <th>Pavadinimas</th>
                            <th>Aprašymas</th>
                            <th>Kaina</th>
                            <th>Statusas</th>
                            <th>Veiksmai</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(service => (
                            <tr key={service.id}>
                                <td>{service.name}</td>
                                <td>{service.description}</td>
                                <td>{service.price_min} - {service.price_max} €</td>
                                <td>{service.status === 'active' ? 'Aktyvi' : 'Išjungta'}</td>
                                <td>
                                    <img src={editIcon} alt="Edit" className="action-icon" />
                                    <img src={trashIcon} alt="Delete" className="action-icon" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}