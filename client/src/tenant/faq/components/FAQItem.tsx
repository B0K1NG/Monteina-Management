import React from 'react';
import { FAQ } from '../data/faqs';

interface Props {
  faq: FAQ;
  isActive: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<Props> = ({ faq, isActive, onToggle }) => (
  <div className="faq-item">
    <button className="faq-question" onClick={onToggle}>
      {faq.question}
      <span className="faq-icon">{isActive ? '−' : '+'}</span>
    </button>
    {isActive && <p className="faq-answer">{faq.answer}</p>}
  </div>
);

export default FAQItem;
