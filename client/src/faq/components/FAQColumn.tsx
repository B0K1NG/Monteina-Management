import React from 'react';
import FAQItem from './FAQItem';
import { FAQ } from '../data/faqs';

interface Props {
  items: FAQ[];
  offset: number;
  activeIndex: number | null;
  toggle: (i: number) => void;
}

const FAQColumn: React.FC<Props> = ({ items, offset, activeIndex, toggle }) => (
  <div className="faq-column">
    {items.map((faq, idx) => {
      const realIndex = offset + idx;
      return (
        <FAQItem
          key={realIndex}
          faq={faq}
          isActive={activeIndex === realIndex}
          onToggle={() => toggle(realIndex)}
        />
      );
    })}
  </div>
);

export default FAQColumn;
