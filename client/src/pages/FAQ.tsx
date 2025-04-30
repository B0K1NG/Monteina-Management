import React from 'react';
import '../styles/client_pages/_faq.scss';
import FAQList from '../faq/components/FAQList';

const FAQPage: React.FC = () => (
  <div className="faq-container">
    <h1 className="faq-title">Dažniausiai užduodami klausimai</h1>
    <h2 className="faq-subtitle">
      Raskite greitus atsakymus į dažniausiai užduodamus klausimus apie mūsų montavimo paslaugas.
    </h2>
    <FAQList />
  </div>
);

export default FAQPage;
