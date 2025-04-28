import { useEffect, useState } from "react";
import { fetchUserInfo } from "../api/auth";
import { fetchPreviousVisits } from "../api/booking";
import { fetchActiveBookings } from "../api/booking";
import { cancelBooking } from "../api/booking";
import { changePassword } from "../api/auth";

export default function Profile() {

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [previousVisits, setPreviousVisits] = useState<{ bookingDate: string; totalAmount: number }[]>([]);
  const [activeBookings, setActiveBookings] = useState<{ id: number; bookingDate: string; bookingTime: string; serviceName: string }[]>([]);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "********",
  });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const user = await fetchUserInfo();
        console.log('Fetched User Info:', user);
        setUserInfo({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          password: "********",
        });
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    const getPreviousVisits = async () => {
      try {
        const visits = await fetchPreviousVisits();
        console.log('Fetched Previous Visits:', visits);
        setPreviousVisits(visits);
      } catch (error) {
        console.error("Failed to fetch previous visits:", error);
      }
    }

    const getActiveBookings = async () => {
      try {
        const bookings = await fetchActiveBookings();
        console.log('Fetched Active Bookings:', bookings);
        setActiveBookings(bookings);
      } catch (error) {
        console.error("Failed to fetch active bookings:", error);
      }
    }

    getActiveBookings();
    getPreviousVisits();
    getUserInfo();
  }, []);

  const handleCancelBooking = async (id: number) => {
    try {
      await cancelBooking(id);
      setActiveBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== id)
      );
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setMessage('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        handleClosePasswordModal();
      }, 3000);
    } catch (error) {
      setMessage('Failed to change password. Please try again.');
    }
  };

  const handleOpenPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage('');
  };

  const handleOpenCancelModal = (id: number) => {
    setSelectedBookingId(id);
    setIsCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setSelectedBookingId(null);
    setIsCancelModalOpen(false);
  };

  const handleConfirmCancel = async () => {
    if (selectedBookingId !== null) {
      await handleCancelBooking(selectedBookingId);
      handleCloseCancelModal();
    }
  };

  const handleOpenInvoiceModal = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsInvoiceModalOpen(true);
  };

  const handleCloseInvoiceModal = () => {
    setSelectedInvoice(null);
    setIsInvoiceModalOpen(false);
  };

  return (
    <div className="profile-container">
      {/* Left Section: User Information */}
      <div className="profile-left">
        <h2 className="section-title">Vartotojo informacija</h2>
        <div className="info-item">
          <label>Vardas ir Pavardė</label>
          <div className="info-value">{`${userInfo.firstName} ${userInfo.lastName}`}</div>
        </div>
        <div className="info-item">
          <label>El. paštas</label>
          <div className="info-value">{userInfo.email}</div>
        </div>
        <div className="info-item">
          <label>Telefono numeris</label>
          <div className="info-value">{userInfo.phoneNumber}</div>
        </div>
        <div className="info-item">
          <label>Slaptažodis</label>
          <div className="info-value">********</div>
          <button className="change-password-button" onClick={handleOpenPasswordModal}>Keisti slaptažodį</button>
        </div>
      </div>

      {/* Center Section: Previous Visits */}
      <div className="profile-center">
        <h2 className="section-title">Senos sąskaitos</h2>
        {previousVisits.length > 0 ? (
          previousVisits.map((visit, index) => (
            <div key={index} className="visit-item">
              <div className="visit-date">{new Date(visit.bookingDate).toLocaleDateString()}</div>
              <div className="visit-total">{visit.totalAmount} €</div>
              <button
                className="view-invoice-button"
                onClick={() => handleOpenInvoiceModal(visit)}
              >
                Peržiūrėti sąskaitą
              </button>
            </div>
          ))
        ) : (
          <p>Nėra ankstesnių sąskaitų.</p>
        )}
      </div>

      {/* Right Section: Upcoming Visits */}
      <div className="profile-right">
        <h2 className="section-title">Ateinantis vizitas</h2>
        {activeBookings.length > 0 ? (
          activeBookings.map((booking) => (
            <div key={booking.id} className="booking-item">
              <div className="booking-date">{new Date(booking.bookingDate).toLocaleDateString()}</div>
              <div className="booking-time">{booking.bookingTime}</div>
              <div className="booking-service">{booking.serviceName}</div>
              <button
                className="cancel-booking-button"
                onClick={() => handleOpenCancelModal(booking.id)}
              >
                Atšaukti vizitą
              </button>
            </div>
          ))
        ) : (
          <p>Nėra ateinančių vizitų.</p>
        )}
      </div>

      {isPasswordModalOpen && (
        <div className="password-modal">
          <div className="modal-content">
            <h2>Keisti slaptažodį</h2>
            <input
              type="password"
              placeholder="Dabartinis slaptažodis"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Naujas slaptažodis"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Pakartokite naują slaptažodį"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handleChangePassword}>Atnaujinti slaptažodį</button>
            <button className="close-modal-button" onClick={handleClosePasswordModal}>Uždaryti</button>
            {message && <p>{message}</p>}
          </div>
        </div>
      )}

      {isCancelModalOpen && (
        <div className="cancel-modal">
          <div className="modal-content">
            <h2>Atšaukti vizitą</h2>
            <p>Ar jūs esate įsitikinęs, kad norite atšaukti savo vizitą? (Avansas nėra grąžinamas)</p>
            <div className="modal-buttons">
              <button className="cancel-button" onClick={handleCloseCancelModal}>Grįžti</button>
              <button className="confirm-button" onClick={handleConfirmCancel}>Atšaukti</button>
            </div>
          </div>
        </div>
      )}

      {isInvoiceModalOpen && selectedInvoice && (
        <div className="invoice-modal">
          <div className="modal-content">
            <h2>Sąskaitos informacija</h2>
            <p><strong>Data:</strong> {new Date(selectedInvoice.bookingDate).toLocaleDateString()}</p>
            <p><strong>Paslauga:</strong> {selectedInvoice.serviceName}</p>
            <p><strong>Suma:</strong> {selectedInvoice.totalAmount} €</p>
            <button className="close-modal-button" onClick={handleCloseInvoiceModal}>Uždaryti</button>
          </div>
        </div>
      )}
    </div>
  );
}