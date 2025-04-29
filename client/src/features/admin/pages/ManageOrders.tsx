import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import axios from '../../../api/axios';
import { createOrder } from '../../../api/booking';
import { getAllMakes, getModelsForMake } from '../../../api/vehicles';

import Dropdown from '../../../components/Dropdown';

export default function ManageOrders() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isFinalConfirmModalOpen, setIsFinalConfirmModalOpen] = useState(false);
    const [users, setUsers] = useState<{ id: string; firstName: string; lastName: string }[]>([]);
    const [services, setServices] = useState<{ id: string; name: string; price_min?: number }[]>([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [repairOption, setRepairOption] = useState<string | null>(null);
    const [valveChange, setValveChange] = useState(false);
    const [tireQuantity, setTireQuantity] = useState('');
    const [tireSize, setTireSize] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [carDetails, setCarDetails] = useState({
        make: '',
        model: '',
        year: '',
        tireSize: '',
    });
    const [carMakes, setCarMakes] = useState<string[]>([]);
    const [carModels, setCarModels] = useState<{ [key: string]: string[] }>({});
    const [selectedMake, setSelectedMake] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [bookedTimes, setBookedTimes] = useState<string[]>([]);
    const [filterDate, setFilterDate] = useState('');
    const [filterService, setFilterService] = useState(''); 
    const [filterStatus, setFilterStatus] = useState('');
    const [bookings, setBookings] = useState<{ id: string; bookingDate: string; bookingTime: string; userName: string; serviceName: string; status: string; serviceId: string }[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<{
        id: string;
        bookingDate: string;
        bookingTime: string;
        userName: string;
        serviceName: string;
        status: string;
        serviceId: string;
    } | null>(null);
    
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setSelectedUser('');
        setSelectedService('');
        setSelectedDate('');
        setSelectedStatus('');
        setSelectedTime('');
        setTireSize('');
        setCarDetails({ make: '', model: '', year: '', tireSize: '' });
        setRepairOption(null);
        setValveChange(false);
        setTireQuantity('');
        setTotalAmount('');
        setIsModalOpen(false);
    };

    const openEditModal = (booking: { id: string; bookingDate: string; bookingTime: string; userName: string; serviceName: string; status: string; serviceId: string }) => {
        setSelectedBooking(booking);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedBooking(null);
        setIsEditModalOpen(false);
      };

    const openCancelModal = () => {
        setIsCancelModalOpen(true);
        setIsEditModalOpen(false);
    };
    
    const closeCancelModal = () => {
        setIsCancelModalOpen(false);
        setIsEditModalOpen(true);
    };

    const openFinalConfirmModal = () => {
        setIsFinalConfirmModalOpen(true);
        setIsEditModalOpen(false);
    };
    
    const closeFinalConfirmModal = () => {
        setIsFinalConfirmModalOpen(false);
        setIsEditModalOpen(true);
    };

    useEffect(() => {
        axios.get('/api/users').then((response) => {
            setUsers(response.data);
        });

        axios.get('/api/services').then((response) => {
            setServices(response.data);
        });
    }, []);

    useEffect(() => {
        getAllMakes()
            .then((makes) => setCarMakes(makes.map((m: any) => m.Make_Name)))
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!selectedMake) return;
        if (carModels[selectedMake]) return;
        getModelsForMake(selectedMake)
            .then((models) =>
                setCarModels((prev) => ({
                    ...prev,
                    [selectedMake]: models.map((m: any) => m.Model_Name),
                }))
            )
            .catch(console.error);
    }, [selectedMake, carModels]);

    useEffect(() => {
        if (selectedBooking) {
          setSelectedDate(selectedBooking.bookingDate);
        }
      }, [selectedBooking]);

    useEffect(() => {
        if (!selectedDate) return;

        axios.get('/api/checkout/bookings', {
            params: { date: selectedDate },
          })
          .then(({ data }) => {
            const fullyBooked = data
              .filter(({ _count }: { _count: { bookingTime: number } }) => _count?.bookingTime >= 2)
              .map(({ bookingTime }: { bookingTime: string }) => bookingTime);
            
            console.log('Fully booked time slots:', fullyBooked);
            setBookedTimes(fullyBooked);
          })
          .catch(console.error);
        }, [selectedDate]);
        

        useEffect(() => {
            axios.get('/api/checkout/all-bookings')
              .then(({ data }) => setBookings(data))
              .catch((error) => {
                console.error('Failed to fetch bookings:', error);
                toast.error('Nepavyko gauti užsakymų duomenų.');
              });
          }, []);

    const saveChanges = async (booking: typeof selectedBooking) => {
        try {
            if (!booking?.id || !booking.bookingTime) {
                throw new Error('Missing booking ID or booking time.');
            }

            const payload = {
                ...booking,
                bookingTime: booking.bookingTime,
            };

            console.log('Payload being sent to backend:', payload);

            const response = await axios.patch(`/api/checkout/${booking.id}`, payload);

            console.log('Backend response:', response);

            if (response.status === 200) {
                toast.success('Pakeitimai sėkmingai patvirtinti!');
                closeModal();

                const updatedBookings = await axios.get('/api/checkout/all-bookings');
                setBookings(updatedBookings.data);
            } else {
                throw new Error('Failed to update booking on the backend.');
            }
        } catch (error) {
            console.error('Error updating booking:', error);
            toast.error('Nepavyko atnaujinti užsakymo.');
        }
    };

      const cancelBooking = async (id: string) => {
        try {
          await axios.patch(`/api/checkout/${id}`, { status: 'canceled' });
          toast.success('Užsakymas atšauktas!');
          closeModal();
          const updatedBookings = await axios.get('/api/checkout/all-bookings');
          setBookings(updatedBookings.data);
        } catch (error) {
          toast.error('Nepavyko atšaukti užsakymo.');
        }
      };

    const handleAddOrder = async () => {
        if (
            !selectedUser ||
            !selectedService ||
            !selectedDate ||
            !selectedStatus ||
            !selectedTime ||
            !tireSize ||
            !carDetails.make ||
            !carDetails.model ||
            !carDetails.year ||
            !totalAmount ||
            (services.find((service) => service.id === selectedService)?.name === 'Padangos remontas' && (!repairOption || !tireQuantity))
        ) {
            toast.error('Prašome užpildyti visus laukus prieš pridedant užsakymą.');
            return;
        }

        const serviceId = `MONT${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-001`;

        const remainingAmount = parseFloat(totalAmount) - 0;

        try {
            const newOrder = await createOrder({
                paymentStatus: 'success',
                userId: selectedUser,
                bookingDate: selectedDate,
                bookingTime: selectedTime,
                serviceId: serviceId,
                status: selectedStatus,
                repairOption: repairOption || undefined,
                valveChange,
                tireQuantity: parseInt(tireQuantity, 10),
                tireSize: tireSize,
                carDetails: {
                    make: carDetails.make,
                    model: carDetails.model,
                    tireSize: tireSize,
                },
                selectedService: {
                    name: services.find((service) => service.id === selectedService)?.name || '',
                },
                totalAmount: parseFloat(totalAmount),
                advanceAmount: 0,
                remainingAmount,
            });

            console.log('New order created:', newOrder);
            toast.success('Užsakymas sėkmingai pridėtas!');
            closeModal();
        } catch (error) {
            toast.error('Nepavyko pridėti užsakymo. Prašome pabandyti dar kartą.');
        }
    };

    useEffect(() => {
        console.log('Selected Service:', selectedService);
    }, [selectedService]);

    const normalizeTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        return `${hours.padStart(2, '0')}:${minutes}`;
    };

    useEffect(() => {
        axios.get('/api/checkout/all-bookings')
            .then(({ data }) => {
                const normalizedBookings = data.map((booking: { bookingTime: string; status: string }) => ({
                    ...booking,
                    bookingTime: normalizeTime(booking.bookingTime),
                }));
                setBookings(normalizedBookings);

                const fullyBookedTimes = normalizedBookings
                    .filter(({ status }: { status: string }) => status === 'active')
                    .map(({ bookingTime }: { bookingTime: string }) => bookingTime);
                setBookedTimes(fullyBookedTimes);
            })
            .catch((error) => {
                console.error('Failed to fetch bookings:', error);
                toast.error('Nepavyko gauti užsakymų duomenų.');
            });
    }, [])

    const filteredBookings = bookings.filter((booking) => {
        const bookingDateFormatted = new Date(booking.bookingDate).toISOString().split('T')[0];
        return (
            (!filterDate || bookingDateFormatted === filterDate) &&
            (!filterService || booking.serviceName === filterService) &&
            (!filterStatus || booking.status.toLowerCase() === filterStatus.toLowerCase())
        );
    });

    const localizedStatus = {
        done: 'Baigtas',
        active: 'Aktyvus',
        canceled: 'Atšauktas',
    };

    const isTimeSlotBooked = (time: string): boolean => {
        if (!selectedDate || !bookedTimes.length) return false;

        if (isEditModalOpen && selectedBooking && selectedBooking.bookingTime === time) {
            return false;
        }
        
        return bookedTimes.includes(time);
    };

    return (
        <div className="manage-orders-container">
            <h1 className="manage-orders-title">Užsakymų valdymas</h1>
            <div className="manage-orders-actions">
                <button className="add-order-button" onClick={openModal}>
                    + Pridėti užsakymą
                </button>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Pridėti Užsakymą</h2>
                        <div className="modal-grid">
    <label>Klientas</label>
    <Dropdown
        options={users.map((user) => ({
            value: user.id,
            label: `${user.firstName} ${user.lastName[0]}.`,
        }))}
        value={selectedUser}
        onChange={setSelectedUser}
        placeholder="Pasirinkite klientą"
    />

    <label>Paslauga</label>
    <Dropdown
        options={services.map((service) => ({
            value: service.id,
            label: service.name,
        }))}
        value={selectedService}
        onChange={setSelectedService}
        placeholder="Pasirinkite paslaugą"
    />

    {services.find((service) => service.id === selectedService)?.name === 'Padangos remontas' && (
        <>
            <label>Remonto tipas</label>
            <Dropdown
                options={[{
                    value: 'ventiliu-keitimas',
                    label: 'Ventilių keitimas'
                }, {
                    value: 'siulo-iverimas',
                    label: 'Siūlo įvėrimas'
                }, {
                    value: 'lopas',
                    label: 'Lopo dėjimas'
                }]}
                value={repairOption || ''}
                onChange={setRepairOption}
                placeholder="Pasirinkite remonto tipą"
            />
        </>
    )}

    <label>Ratų išmatavimai</label>
    <Dropdown
        options={Array.from({ length: 16 }, (_, i) => {
            const size = `R${i + 10}`;
            return { value: size, label: size };
        })}
        value={tireSize}
        onChange={setTireSize}
        placeholder="Pasirinkite ratų išmatavimus"
    />

    <label>Ratų kiekis</label>
    <Dropdown
        options={Array.from({ length: 100 }, (_, i) => ({
            value: `${i + 1}`,
            label: `${i + 1} vnt.`,
        }))}
        value={tireQuantity}
        onChange={setTireQuantity}
        placeholder="Pasirinkite ratų kiekį"
    />

        <label>Data</label>
        <Dropdown
    options={[
        { value: '', label: 'Visos datos' },
        ...Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const formattedDate = date.toISOString().split('T')[0];
            return { value: formattedDate, label: formattedDate };
        }),
    ]}
    value={filterDate}
    onChange={(value) => {
        setFilterDate(value);
        setSelectedDate(value);
      }}
    placeholder="Pasirinkite datą"
/>

    <label>Statusas</label>
    <Dropdown
        options={[
            { value: 'Active', label: 'Aktyvus' },
            { value: 'Done', label: 'Baigtas' },
            { value: 'Canceled', label: 'Atšauktas' },
        ]}
        value={selectedStatus}
        onChange={setSelectedStatus}
        placeholder="Pasirinkite statusą"
    />

    <label>Laikas</label>
    <Dropdown
        options={Array.from({ length: 22 }, (_, i) => {
            const hours = Math.floor(i / 2) + 9;
            const minutes = i % 2 === 0 ? '00' : '30';
            const time = `${hours}:${minutes}`;
            const isBooked = isTimeSlotBooked(time);
            
            return {
                value: time,
                label: time,
                className: isBooked ? 'time-slot disabled' : 'time-slot',
                disabled: isBooked,
            };
        })}
        value={selectedTime}
        onChange={(value) => {
            if (!isTimeSlotBooked(value)) {
                setSelectedTime(value);
            }
        }}
        placeholder="Pasirinkite laiką"
    />

    <label>Gamintojas</label>
    <Dropdown
        options={carMakes.map((make) => ({ value: make, label: make }))}
        value={carDetails.make}
        onChange={(value) => {
            setCarDetails((prev) => ({ ...prev, make: value }));
            setSelectedMake(value);
        }}
        placeholder="Pasirinkite gamintoją"
        searchable
    />

    <label>Modelis</label>
    <Dropdown
        options={(carModels[carDetails.make] || []).map((model) => ({
            value: model,
            label: model,
        }))}
        value={carDetails.model}
        onChange={(value) => setCarDetails((prev) => ({ ...prev, model: value }))}
        placeholder="Pasirinkite modelį"
        disabled={!carDetails.make}
        searchable
    />

    <label>Pagaminimo metai</label>
    <Dropdown
        options={Array.from({ length: 30 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return { value: String(year), label: String(year) };
        })}
        value={carDetails.year}
        onChange={(value) => setCarDetails((prev) => ({ ...prev, year: value }))}
        placeholder="Pasirinkite pagaminimo metus"
    />

        <label>Bendra suma</label>
        <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            placeholder="Įveskite bendrą sumą"
            className="total-amount-input"
        />
    </div>
        <label>
            Ventilių keitimas
            <input
                type="checkbox"
                checked={valveChange}
                onChange={(e) => setValveChange(e.target.checked)}
            />
        </label>

                        <div className="modal-buttons">
                            <button className="close-modal-button" onClick={closeModal}>
                                Atšaukti
                            </button>
                            <button className="close-modal-button" onClick={handleAddOrder}>
                                Pridėti
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isCancelModalOpen && (
        <div className="modal">
            <div className="modal-content">
            <h2>Atšaukti Užsakymą</h2>
            <p>Ar jūs esate įsitikinęs, kad norite atšaukti šį vizitą?</p>
            <div className="modal-buttons">
                <button onClick={closeCancelModal}>Atgal</button>
                <button
                onClick={async () => {
                    if (selectedBooking) {
                    try {
                        await cancelBooking(selectedBooking.id);
                        toast.success('Užsakymas sėkmingai atšauktas!');
                        setIsCancelModalOpen(false);
                    } catch (error) {
                        toast.error('Nepavyko atšaukti užsakymo.');
                    }
                    }
                }}
                >
                Atšaukti
                </button>
            </div>
            </div>
        </div>
        )}

        {isEditModalOpen && selectedBooking && (
        <div className="modal">
            <div className="modal-content">
            <h2>Redaguoti Užsakymą</h2>
            <div className="modal-grid">
                <label>Klientas</label>
                <input type="text" value={selectedBooking.userName} disabled />

                <label>Paslauga</label>
                <input type="text" value={selectedBooking.serviceName} disabled />

                <label>Data</label>
                <input
                type="date"
                value={selectedBooking.bookingDate}
                onChange={(e) =>
                    setSelectedBooking((prev) =>
                    prev ? { ...prev, bookingDate: e.target.value } : null
                    )
                }
                />

                <label>Laikas</label>
                <Dropdown
                options={Array.from({ length: 22 }, (_, i) => {
                    const hours = Math.floor(i / 2) + 9;
                    const minutes = i % 2 === 0 ? '00' : '30';
                    const time = `${hours}:${minutes}`;

                    const isBooked = isTimeSlotBooked(time) && time !== selectedBooking.bookingTime;
                    
                    return {
                    value: time,
                    label: time,
                    className: isBooked ? 'time-slot disabled' : 'time-slot',
                    disabled: isBooked,
                    };
                })}
                value={selectedBooking?.bookingTime || ''}
                onChange={(value) => {
                    if (!isTimeSlotBooked(value) || value === selectedBooking.bookingTime) {
                        setSelectedBooking((prev) =>
                            prev ? { ...prev, bookingTime: value } : null
                        );
                    }
                }}
                placeholder="Pasirinkite laiką"
                />


                {selectedBooking.status === 'canceled' ? (
                <label>Statusas</label>
                ) : null}
                {selectedBooking.status === 'canceled' && (
                <Dropdown
                    options={[
                    { value: 'active', label: 'Aktyvus' },
                    { value: 'done', label: 'Baigtas' },
                    { value: 'canceled', label: 'Atšauktas' },
                    ]}
                    value={selectedBooking.status}
                    onChange={(value) =>
                    setSelectedBooking((prev) =>
                        prev ? { ...prev, status: value } : null
                    )
                    }
                />
                )}
            </div>

            <div className="modal-buttons">
                {selectedBooking.status !== 'canceled' && (
                <button onClick={openCancelModal}>Atšaukti Užsakymą</button>
                )}
                <button onClick={openFinalConfirmModal}>Patvirtinti Pakeitimus</button>
                <button onClick={closeEditModal}>Atšaukti</button>
            </div>
            </div>
        </div>
        )}

        {isFinalConfirmModalOpen && (
        <div className="modal">
            <div className="modal-content">
            <h2>Patvirtinti Pakeitimus</h2>
            <p>Ar jūs tikrai norite patvirtinti šiuos pakeitimus?</p>
            <div className="modal-buttons">
                <button onClick={closeFinalConfirmModal}>Atgal</button>
                <button
                onClick={async () => {
                    try {
                    const statusMapping = {
                        aktyvus: 'active',
                        baigtas: 'done',
                        atšauktas: 'canceled',
                    };
                    const updatedBooking = {
                        ...selectedBooking,
                        status: statusMapping[selectedBooking?.status as keyof typeof statusMapping] || selectedBooking?.status,
                    };
                    if (updatedBooking?.id && updatedBooking.bookingDate && updatedBooking.bookingTime && updatedBooking.userName && updatedBooking.serviceName && updatedBooking.status && updatedBooking.serviceId) {
                        await saveChanges(updatedBooking as {
                        id: string;
                        bookingDate: string;
                        bookingTime: string;
                        userName: string;
                        serviceName: string;
                        status: string;
                        serviceId: string;
                        });
                    } else {
                        toast.error('Nepavyko patvirtinti pakeitimų. Trūksta duomenų.');
                    }
                    setIsFinalConfirmModalOpen(false);
                    } catch (error) {
                    toast.error('Nepavyko patvirtinti pakeitimų.');
                    }
                }}
                >
                Patvirtinti
                </button>
            </div>
            </div>
        </div>
        )}

            <div className="filters">
                <Dropdown
                    options={[
                        { value: '', label: 'Visos datos' },
                        ...Array.from({ length: 60 }, (_, i) => {
                          const date = new Date();
                          date.setDate(date.getDate() - 30 + i);
                          const formattedDate = date.toISOString().split('T')[0];
                          return { value: formattedDate, label: formattedDate };
                        })
                      ]}
                    value={filterDate}
                    onChange={(value) => {
                        setFilterDate(value);
                        setSelectedDate(value);
                      }}
                    placeholder="Pasirinkite datą"
                />

                <Dropdown
                    options={[
                        { value: '', label: 'Visos paslaugos' },
                        ...services.map((service) => ({
                            value: service.name,
                            label: service.name,
                        })),
                    ]}
                    value={filterService}
                    onChange={setFilterService}
                    placeholder="Pasirinkite paslaugą"
                />

                <Dropdown
                    options={[
                        { value: '', label: 'Visi statusai' },
                        { value: 'active', label: 'Aktyvus' },
                        { value: 'done', label: 'Baigtas' },
                        { value: 'canceled', label: 'Atšauktas' },
                    ]}
                    value={filterStatus}
                    onChange={setFilterStatus}
                    placeholder="Pasirinkite statusą"
                />
            </div>

            <table className="orders-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Laikas</th>
                        <th>Klientas</th>
                        <th>Paslauga</th>
                        <th>Statusas</th>
                        <th>Veiksmai</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                            <tr key={booking.id}>
                                <td>{booking.bookingDate}</td>
                                <td>{booking.bookingTime}</td>
                                <td>{booking.userName}</td>
                                <td>{booking.serviceName}</td>
                                <td>{localizedStatus[booking.status.toLowerCase() as keyof typeof localizedStatus] || booking.status}</td>
                                <td>
                                    <button onClick={() => openEditModal(booking)}>Edit</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6}>Nėra užsakymų</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}