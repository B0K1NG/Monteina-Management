import { useProfileData } from '../../tenant/profile/hooks/userProfileData';
import { useModal } from '../../tenant/profile/hooks/useModal';
import UserInfoPanel from '../../tenant/profile/components/UserInfo';
import PreviousVisits from '../../tenant/profile/components/PreviousVisits';
import ActiveBookings from '../../tenant/profile/components/ActiveBookings';
import PasswordModal from '../../tenant/profile/components/PasswordModal';
import PhoneModal from '../../tenant/profile/components/PhoneModal';
import CancelModal from '../../tenant/profile/components/CancelModal';
import InvoiceModal from '../../tenant/profile/components/InvoiceModal';
import { handleCancelBooking } from '../../tenant/profile/components/bookingHandlers';

export default function ProfilePage() {
  const { userInfo, previousVisits, activeBookings, setActiveBookings, updatePhoneNumber } = useProfileData();
  const { modal, openPassword, openPhone, openCancel, openInvoice, close } = useModal();

  if (!userInfo) return null;

  const handlePhoneUpdate = async (newPhone: string) => {
    const success = await updatePhoneNumber(newPhone);
    if (success) {
      close();
    }
  };

  return (
    <div className="profile-page">
      <h1 className="profile-title">
        Sveiki, {userInfo.firstName}!
      </h1>
      <div className="profile-container">
        <UserInfoPanel 
          user={userInfo} 
          onChangePassword={openPassword}
          onEditPhone={openPhone}
          />
        <PreviousVisits visits={previousVisits} onViewInvoice={openInvoice} />
        <ActiveBookings bookings={activeBookings} onCancel={openCancel} />
      </div>

      {modal?.type === 'password' && (
        <PasswordModal onClose={close} />
      )}
      {modal?.type === 'phone' && (
        <PhoneModal 
          currentPhone={userInfo.phoneNumber} 
          onClose={close} 
          onUpdate={handlePhoneUpdate} 
        />
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
