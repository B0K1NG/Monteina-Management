import { UserInfo } from '../types';

interface Props {
  user: UserInfo;
  onChangePassword(): void;
  onEditPhone(): void;
}

export default function UserInfoPanel({ user, onChangePassword, onEditPhone }: Props) {
  return (
    <div className="profile-left panel">
      <h2 className="section-title">Vartotojo informacija</h2>
      <div className="info-item">
        <label>Vardas ir Pavardė</label>
        <div className="info-value">
          {user.firstName} {user.lastName}
        </div>
      </div>
      <div className="info-item">
        <label>El. paštas</label>
        <div className="info-value">{user.email}</div>
      </div>
      <div className="info-item info-item--password">
        <label>Tel. Nr.</label>
        <div className="info-value">{user.phoneNumber}</div>
        <button
          className="btn btn--secondary change-password-button"
          onClick={onEditPhone}
        >
          Keisti numerį
        </button>
      </div>
      <div className="info-item info-item--password">
        <label>Slaptažodis</label>
        <div className="info-value">********</div>
        <button
          className="btn btn--secondary change-password-button"
          onClick={onChangePassword}
        >
          Keisti slaptažodį
        </button>
      </div>
    </div>
  );
}
