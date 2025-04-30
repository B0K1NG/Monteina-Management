export interface FAQ {
    question: string;
    answer: string;
  }
  
  export const faqs: FAQ[] = [
    { question: 'Kaip rezervuoti montavimo paslaugą?', answer: 'Išsirinkite paslaugą, pasirinkite jums patogų laiką kalendoriuje ir patvirtinkite rezervaciją atlikdami avansinį mokėjimą.' },
    { question: 'Ar paslaugos kaina apima ventilio keitimą?', answer: 'Jei reikalingas ventilio keitimas, taikomas papildomas 5 € mokestis.' },
    { question: 'Kokius automobilius aptarnaujate?', answer: 'Aptarnaujami tik lengvieji automobiliai ir džipai.' },
    { question: 'Ar nurodyta kaina taikoma visiems ratų kiekiams?', answer: 'Pateiktos kainos taikomos darbui su 1 ratu. Suvedus visus reikalingus duomenys rezervuojant laiką apmokėjimo metu matysite galutinę kainą. Avansas nėra grąžinamas.' },
    { question: 'Ar reikia atvykti tiksliai nurodytu laiku?', answer: 'Taip, siekiant užtikrinti sklandų darbą ir kitų klientų laikų laikymąsi, prašome atvykti tiksliai rezervuotu laiku.' },
    { question: 'Ar galiu pakeisti ar atšaukti rezervaciją?', answer: 'Galite tik atšaukti savo vizitą, koreguoti vizito galimybės nėra. Avansas nėra grąžinamas.' },
    { question: 'Kaip žinoti, ar mano rezervacija patvirtinta?', answer: 'Patvirtinimą gausite el. paštu po avanso apmokėjimo. Taip pat galite matyti savo rezervacijas naudotojo paskyroje.' },
    { question: 'Ar galiu atsiskaityti vietoje?', answer: 'Dalis sumos apmokama iš anksto kaip avansas, o likusi suma gali būti sumokėta tik vietoje po paslaugos suteikimo.' },
  ];
  