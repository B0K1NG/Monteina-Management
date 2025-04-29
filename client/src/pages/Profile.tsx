import { useEffect, useState } from "react";
import { fetchUserInfo } from "../api/auth";
import { fetchPreviousVisits } from "../api/booking";
import { fetchActiveBookings } from "../api/booking";
import { cancelBooking } from "../api/booking";
import { changePassword } from "../api/auth";

export default function Profile() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [previousVisits, setPreviousVisits] = useState<
    { bookingDate: string; totalAmount: number }[]
  >([]);
  const [activeBookings, setActiveBookings] = useState<
    { id: number; bookingDate: string; bookingTime: string; serviceName: string }[]
  >([]);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [user, visits, bookings] = await Promise.all([
          fetchUserInfo(),
          fetchPreviousVisits(),
          fetchActiveBookings(),
        ]);
        setUserInfo({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
        });
        setPreviousVisits(visits);
        setActiveBookings(bookings);
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Nauji slaptažodžiai nesutampa.");
      return;
    }
    try {
      await changePassword(currentPassword, newPassword);
      setMessage("Slaptažodis sėkmingai pakeistas!");
      setTimeout(() => closePasswordModal(), 2000);
    } catch {
      setMessage(
        "Nepavyko pakeisti slaptažodžio. Susisiekite su administracija."
      );
    }
  };

  const openPasswordModal = () => setIsPasswordModalOpen(true);
  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
  };

  const openCancelModal = (id: number) => {
    setSelectedBookingId(id);
    setIsCancelModalOpen(true);
  };
  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setSelectedBookingId(null);
  };
  const confirmCancel = async () => {
    if (selectedBookingId !== null) {
      await cancelBooking(selectedBookingId);
      setActiveBookings((b) => b.filter((x) => x.id !== selectedBookingId));
      closeCancelModal();
    }
  };

  const openInvoiceModal = (inv: any) => {
    setSelectedInvoice(inv);
    setIsInvoiceModalOpen(true);
  };
  const closeInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
    setSelectedInvoice(null);
  };

  return (
    <div className="profile-page">
      <h1 className="profile-title">Sveiki, {userInfo.firstName}!</h1>
      <div className="profile-container">
        <div className="profile-left panel">
          <h2 className="section-title">Vartotojo informacija</h2>

          <div className="info-item">
            <label>Vardas ir Pavardė</label>
            <div className="info-value">
              {userInfo.firstName} {userInfo.lastName}
            </div>
          </div>

          <div className="info-item">
            <label>El. paštas</label>
            <div className="info-value">{userInfo.email}</div>
          </div>

          <div className="info-item">
            <label>Tel. Nr.</label>
            <div className="info-value-phone">{userInfo.phoneNumber}</div>
          </div>

          <div className="info-item info-item--password">
            <label>Slaptažodis</label>
            <div className="info-value">********</div>
            <button
              className="btn btn--secondary change-password-button"
              onClick={openPasswordModal}
            >
              Keisti slaptažodį
            </button>
          </div>
        </div>

        <div className="profile-center panel">
          <h2 className="section-title">Senos sąskaitos</h2>

          {previousVisits.length > 0 && (
            <div className="visit-item visit-item--header">
              <div className="visit-item__date">Data</div>
              <div className="visit-item__total">Suma</div>
              <div className="visit-item__btn" />
            </div>
          )}

          {previousVisits.length > 0 ? (
            previousVisits.map((visit, i) => (
              <div key={i} className="visit-item">
                <div className="visit-item__date">
                  {new Date(visit.bookingDate)
                    .toISOString()
                    .split("T")[0]}
                </div>
                <div className="visit-item__total">
                  {visit.totalAmount} €
                </div>
                <button
                  className="btn btn--secondary visit-item__btn"
                  onClick={() => openInvoiceModal(visit)}
                >
                  Peržiūrėti
                </button>
              </div>
            ))
          ) : (
            <p>Nėra ankstesnių sąskaitų.</p>
          )}
        </div>

        <div className="profile-right panel">
          <h2 className="section-title">Ateinantis vizitas</h2>

          {activeBookings.length > 0 ? (
            activeBookings.map((b) => (
              <div key={b.id} className="booking-item">
                <div className="booking-item__date">
                  {new Date(b.bookingDate).toISOString().split("T")[0]}
                </div>
                <div className="booking-item__time">{b.bookingTime}</div>
                <button
                  className="btn btn--secondary booking-item__cancel"
                  onClick={() => openCancelModal(b.id)}
                >
                  Atšaukti
                </button>
              </div>
            ))
          ) : (
            <p>Nėra ateinančių vizitų.</p>
          )}
        </div>
      </div>

      {isPasswordModalOpen && (
        <div className="modal-overlay">
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
            <div className="modal-buttons">
              <button
                className="btn btn--secondary close-modal-button"
                onClick={closePasswordModal}
              >
                Uždaryti
              </button>
              <button
                className="btn btn--primary confirm-button"
                onClick={handleChangePassword}
              >
                Atnaujinti slaptažodį
              </button>
            </div>
            {message && <p>{message}</p>}
          </div>
        </div>
      )}

      {isCancelModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Atšaukti vizitą</h2>
            <p>
              Ar jūs esate įsitikinęs, kad norite atšaukti savo vizitą? (Avansas
              nėra grąžinamas)
            </p>
            <div className="modal-buttons">
              <button
                className="btn btn--secondary cancel-button"
                onClick={closeCancelModal}
              >
                Uždaryti
              </button>
              <button
                className="btn btn--danger confirm-button"
                onClick={confirmCancel}
              >
                Atšaukti vizitą
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isInvoiceModalOpen && selectedInvoice && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Sąskaitos informacija</h2>
            <p>
              <strong>Data:</strong>{" "}
              {new Date(selectedInvoice.bookingDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Paslauga:</strong> {selectedInvoice.serviceName}
            </p>
            <p>
              <strong>Suma:</strong> {selectedInvoice.totalAmount} €
            </p>
            <div className="modal-buttons">
              <button
                className="btn btn--secondary close-modal-button"
                onClick={closeInvoiceModal}
              >
                Uždaryti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
