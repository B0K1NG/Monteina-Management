import React from 'react';

interface Props {
  iconSrc: string;
  title: string;
  description: string;
  alt?: string;
}

const Step: React.FC<Props> = ({ iconSrc, title, description, alt }) => (
  <div className="step">
    <img src={iconSrc} alt={alt || title} className="step-icon" />
    <div className="step-content">
      <h3 className="step-title">{title}</h3>
      <p className="step-description">{description}</p>
    </div>
  </div>
);

export default Step;