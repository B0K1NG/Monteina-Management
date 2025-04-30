import '../styles/client_pages/_profile.scss';
import { useProfileData } from '../profile/hooks/userProfileData';
import { useModal } from '../profile/hooks/useModal';
import UserInfoPanel from '../profile/components/UserInfo';
import PreviousVisits from '../profile/components/PreviousVisits';
import ActiveBookings from '../profile/components/ActiveBookings';
import PasswordModal from '../profile/components/PasswordModal';
import CancelModal from '../profile/components/CancelModal';
import InvoiceModal from '../profile/components/InvoiceModal';
import { handleCancelBooking } from '../profile/components/bookingHandlers';

export default function ProfilePage() {
  const { userInfo, previousVisits, activeBookings, setActiveBookings } = useProfileData();
  const { modal, openPassword, openCancel, openInvoice, close } = useModal();

  if (!userInfo) return null;

  return (
    <div className="profile-page">
      <h1 className="profile-title">
        Sveiki, {userInfo.firstName}!
      </h1>
      <div className="profile-container">
        <UserInfoPanel user={userInfo} onChangePassword={openPassword} />
        <PreviousVisits visits={previousVisits} onViewInvoice={openInvoice} />
        <ActiveBookings bookings={activeBookings} onCancel={openCancel} />
      </div>

      {modal?.type === 'password' && (
        <PasswordModal onClose={close} />
      )}
      {modal?.type === 'cancel' && (
        <CancelModal
        onConfirm={() => handleCancelBooking(modal.bookingId, setActiveBookings, close)}
          onClose={close}
        />
      )}
      {modal?.type === 'invoice' && (
        <InvoiceModal invoice={modal.invoice} onClose={close} />
      )}
    </div>
  );
}
