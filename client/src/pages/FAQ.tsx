import { useState } from 'react';
import '../styles/clientPages/_faq.scss';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    { question: 'Kaip rezervuoti montavimo paslaugą?', answer: 'Išsirinkite paslaugą, pasirinkite jums patogų laiką kalendoriuje ir patvirtinkite rezervaciją atlikdami avansinį mokėjimą.' },
    { question: 'Ar paslaugos kaina apima ventilio keitimą?', answer: 'Jei reikalingas ventilio keitimas, taikomas papildomas 5 € mokestis.' },
    { question: 'Kokius automobilius aptarnaujate?', answer: 'Aptarnaujami tik lengvieji automobiliai ir džipai.' },
    { question: ' Ar nurodyta kaina taikoma visiems ratų kiekiams?', answer: 'Pateiktos kainos taikomos darbui su 1 ratu. Suvedus visus reikalingus duomenys rezervuojant laiką apmokėjimo metu matysite galutinę kainą. Avansas nėra grąžinamas.' },

    { question: 'Ar reikia atvykti tiksliai nurodytu laiku?', answer: 'Taip, siekiant užtikrinti sklandų darbą ir kitų klientų laikų laikymąsi, prašome atvykti tiksliai rezervuotu laiku.' },
    { question: 'Ar galiu pakeisti ar atšaukti rezervaciją?', answer: 'Galite tik atšaukti savo vizitą, koreguoti vizito galimybės nėra. Avansas nėra grąžinamas.'},
    { question: 'Kaip žinoti, ar mano rezervacija patvirtinta?', answer: ' Patvirtinimą gausite el. paštu po avanso apmokėjimo. Taip pat galite matyti savo rezervacijas naudotojo paskyroje.' },
    { question: 'Ar galiu atsiskaityti vietoje?', answer: ' Dalis sumos apmokama iš anksto kaip avansas, o likusi suma gali būti sumokėta tik vietoje po paslaugos suteikimo.' },
    
    ];

  const left = faqs.slice(0, 4);
  const right = faqs.slice(4); 

  return (
    <div className="faq-container">
      <h1 className="faq-title">Dažniausiai užduodami klausimai</h1>
      <h2 className="faq-subtitle">Raskite greitus atsakymus į dažniausiai užduodamus klausimus apie mūsų montavimo paslaugas.</h2>
      <div className="faq-list">
        <div className="faq-column">
          {left.map((faq, i) => (
            <div key={i} className="faq-item">
              <button className="faq-question" onClick={() => toggleFAQ(i)}>
                {faq.question}
                <span className="faq-icon">{activeIndex === i ? '−' : '+'}</span>
              </button>
              {activeIndex === i && <p className="faq-answer">{faq.answer}</p>}
            </div>
          ))}
        </div>
        <div className="faq-column">
          {right.map((faq, i) => {
            const idx = i + left.length;
            return (
              <div key={idx} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(idx)}
                >
                  {faq.question}
                  <span className="faq-icon">
                    {activeIndex === idx ? '−' : '+'}
                  </span>
                </button>
                {activeIndex === idx && (
                  <p className="faq-answer">{faq.answer}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQ;