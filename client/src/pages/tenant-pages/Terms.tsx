import React from 'react';
import TermsContent from '../../tenant/terms/components/TermsContent';

const TermsPage: React.FC = () => {
  return (
    <div className="terms-page">
      <div className="terms-container">
        <TermsContent />
      </div>
    </div>
  );
};

export default TermsPage;