import { useState } from 'react';
import '../styles/pages/_faq.scss';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    { question: 'Kaip rezervuoti montavimo paslaugą?', answer: 'Išsirinkite paslaugą, pasirinkite jums patogų laiką kalendoriuje ir patvirtinkite rezervaciją atlikdami avansinį mokėjimą.' },
    { question: 'Ar galima vienu metu užsakyti paslaugas keliems automobiliams?', answer: 'Taip! Rezervacijos metu galite nurodyti automobilių skaičių ir kiekvienam iš jų pasirinkti skirtingas paslaugas.' },
    { question: 'Kiek kainuoja montavimo paslaugos?', answer: 'Paslaugų kainos nurodytos paslaugų puslapyje. Galutinė kaina priklauso nuo pasirinktų paslaugų bei automobilių skaičiaus – visa tai matysite suvestinėje prieš apmokėjimą.' },
    { question: ' Ar galiu pakeisti ar atšaukti rezervaciją?', answer: 'Taip, prisijungę prie savo paskyros galėsite valdyti rezervacijas – keisti laiką ar atšaukti paslaugą, jei liko pakankamai laiko iki rezervacijos.' },

    { question: 'Ar reikia atvykti tiksliai nurodytu laiku?', answer: 'Taip, siekiant užtikrinti sklandų darbą ir kitų klientų laikų laikymąsi, prašome atvykti tiksliai rezervuotu laiku.' },
    { question: 'Ar man reikia pasiruošti automobiliui prieš atvykstant?', answer: 'Ne, viskuo pasirūpins mūsų meistrai. Svarbu, kad automobilis būtų švarus ir pasiekiamas, jei reikia prieigos prie ratų ar padangų.' },
    { question: 'Kaip žinoti, ar mano rezervacija patvirtinta?', answer: ' Patvirtinimą gausite el. paštu po avanso apmokėjimo. Taip pat galite matyti savo rezervacijas naudotojo paskyroje.' },
    { question: 'Ar galiu atsiskaityti vietoje?', answer: ' Dalis sumos apmokama iš anksto kaip avansas, o likusi suma gali būti sumokėta vietoje po paslaugos suteikimo.' },
    
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