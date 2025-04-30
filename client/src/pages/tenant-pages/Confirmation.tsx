import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useConfirmationState } from '../../tenant/confirmation/hooks/useConfirmationState';
import SuccessView from '../../tenant/confirmation/components/SuccessView';
import FailureView from '../../tenant/confirmation/components/FailureView';

const ConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isMissing, isInvalid } = useConfirmationState();

  if (isMissing) return <Navigate to="/" replace />;
  if (isInvalid) return <Navigate to="/not-found" replace />;

  const success = data!.success;

  return (
    <div className={`confirmation-page ${success ? '' : 'confirmation-page--failure'}`}>
      <div className="confirmation-container">
        {success ? (
          <SuccessView state={data!} onBack={() => navigate('/')} />
        ) : (
          <FailureView onRetry={() => navigate(-1)} />
        )}
      </div>
    </div>
  );
};

export default ConfirmationPage;