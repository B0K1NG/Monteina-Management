import React from 'react';
import Step from './Step';

const stepsData = [
  {
    iconSrc: '/src/assets/icons/car_icon.png',
    title: 'Pasirinkite laiką',
    description: 'Išsirinkite jums tinkamą datą ir laiką mūsų sistemoje.',
  },
  {
    iconSrc: '/src/assets/icons/euro_icon.png',
    title: 'Sumokėkite avansą',
    description: 'Rezervacijai patvirtinti užtenka simbolinio avanso.',
  },
  {
    iconSrc: '/src/assets/icons/calendar_icon.png',
    title: 'Atvykite į servisą',
    description: 'Atvykite laiku – viskuo pasirūpinsime.',
  },
];

const Steps: React.FC = () => (
  <section className="how-it-works">
    <h2 className="section-title">Kaip tai veikia</h2>
    <div className="steps-container">
      {stepsData.map((s, i) => (
        <Step
          key={i}
          iconSrc={s.iconSrc}
          title={s.title}
          description={s.description}
        />
      ))}
    </div>
  </section>
);

export default Steps;