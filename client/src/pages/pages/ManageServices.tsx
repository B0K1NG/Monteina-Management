import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import editIcon from '../../../assets/icons/edit.png';
import trashIcon from '../../../assets/icons/trash.png';
import { toast } from 'react-toastify';

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
    const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
    const [serviceName, setServiceName] = useState('');
    const [serviceDescription, setServiceDescription] = useState('');
    const [priceMin, setPriceMin] = useState<number | ''>('');
    const [priceMax, setPriceMax] = useState<number | ''>('');
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

    const closeAddServiceModal = () => setIsAddServiceModalOpen(false);
    const openAddServiceModal = () => {
        setEditingService(null);
        setServiceName('');
        setServiceDescription('');
        setPriceMin('');
        setPriceMax('');
        setIsAddServiceModalOpen(true);
    };

    const handleAddService = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const requestBody = {
                name: serviceName,
                description: serviceDescription,
                price_min: priceMin,
                price_max: priceMax,
                status: 'active',
            };

            const response = await axios.post('/api/services', requestBody);

            if (response.status === 201) {
                toast.success('Paslauga sėkmingai pridėta!');
                closeAddServiceModal();
                setServices((prevServices) => [...prevServices, response.data]);
            } else {
                toast.error('Nepavyko pridėti paslaugos.');
            }
        } catch (error) {
            console.error('Error adding service:', error);
            toast.error('Nepavyko pridėti paslaugos. Prašome pabandyti dar kartą.');
        }
    };

    const openEditServiceModal = (service: Service) => {
        setEditingService(service);
        setServiceName(service.name);
        setServiceDescription(service.description);
        setPriceMin(service.price_min);
        setPriceMax(service.price_max);
        setIsAddServiceModalOpen(true);
    };

    const handleEditService = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;

        try {
            const requestBody = {
                name: serviceName,
                description: serviceDescription,
                price_min: priceMin,
                price_max: priceMax,
                status: editingService.status,
            };

            const response = await axios.put(`/api/services/${editingService.id}`, requestBody);

            if (response.status === 200) {
                toast.success('Paslauga sėkmingai atnaujinta!');
                closeAddServiceModal();
                setServices((prevServices) =>
                    prevServices.map((service) =>
                        service.id === editingService.id ? response.data : service
                    )
                );
            } else {
                toast.error('Nepavyko atnaujinti paslaugos.');
            }
        } catch (error) {
            console.error('Error editing service:', error);
            toast.error('Nepavyko atnaujinti paslaugos. Prašome pabandyti dar kartą.');
        }
    };

    const openDeleteServiceModal = (service: Service) => {
        setServiceToDelete(service);
    };

    const closeDeleteServiceModal = () => {
        setServiceToDelete(null);
    };

    const handleDeleteService = async () => {
        if (!serviceToDelete) return;

        try {
            const response = await axios.delete(`/api/services/${serviceToDelete.id}`);

            if (response.status === 200) {
                toast.success('Paslauga sėkmingai ištrinta!');
                setServices((prevServices) =>
                    prevServices.filter((service) => service.id !== serviceToDelete.id)
                );
                closeDeleteServiceModal();
            } else {
                toast.error('Nepavyko ištrinti paslaugos.');
            }
        } catch (error) {
            console.error('Error deleting service:', error);
            toast.error('Nepavyko ištrinti paslaugos. Prašome pabandyti dar kartą.');
        }
    };

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
                <button className="add-service-button" onClick={openAddServiceModal}>
                    + Pridėti paslaugą
                </button>
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
                                    <img src={editIcon} alt="Edit" className="action-icon" onClick={() => openEditServiceModal(service)} />
                                    <img src={trashIcon} alt="Delete" className="action-icon" onClick={() => openDeleteServiceModal(service)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isAddServiceModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Paslaugos Pridėjimas</h2>
                        <form onSubmit={editingService ? handleEditService : handleAddService}>
                            <label>Paslaugos pavadinimas</label>
                            <input type="text" placeholder="Įveskite pavadinimą" value={serviceName} onChange={(e) => setServiceName(e.target.value)} />

                            <label>Aprašymas</label>
                            <textarea placeholder="Įveskite aprašymą" value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)}></textarea>

                            <label>Kaina (žemiausia)</label>
                            <input type="number" placeholder="Įveskite žemiausią kainą" value={priceMin} onChange={(e) => setPriceMin(e.target.value === '' ? '' : Number(e.target.value))} />

                            <label>Kaina (aukščiausia)</label>
                            <input type="number" placeholder="Įveskite aukščiausią kainą" value={priceMax} onChange={(e) => setPriceMax(e.target.value === '' ? '' : Number(e.target.value))} />

                            <div className="modal-buttons">
                                <button type="button" onClick={closeAddServiceModal}>
                                    Atšaukti
                                </button>
                                <button type="submit">Išsaugoti</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {serviceToDelete && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Patvirtinti paslaugos šalinimą</h2>
                        <p>Ar tikrai norite pašalinti paslaugą "{serviceToDelete.name}"?</p>
                        <div className="modal-buttons">
                            <button type="button" onClick={closeDeleteServiceModal}>
                                Atšaukti
                            </button>
                            <button type="button" onClick={handleDeleteService}>Pašalinti</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}