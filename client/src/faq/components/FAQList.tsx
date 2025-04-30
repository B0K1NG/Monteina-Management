import React from 'react';
import { faqs } from '../data/faqs';
import FAQColumn from './FAQColumn';
import { useActiveIndex } from '../hooks/useActiveIndex';

const FAQList: React.FC = () => {
  const { activeIndex, toggle } = useActiveIndex();
  const left = faqs.slice(0, 4);
  const right = faqs.slice(4);
  
  return (
    <div className="faq-list">
      <FAQColumn items={left} offset={0} activeIndex={activeIndex} toggle={toggle} />
      <FAQColumn items={right} offset={4} activeIndex={activeIndex} toggle={toggle} />
    </div>
  );
};

export default FAQList;
