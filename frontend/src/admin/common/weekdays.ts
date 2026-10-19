/** Dni tygodnia (enum Weekday z API) z polskimi nazwami – od poniedziałku */
export const weekdayOption = [
  { id: 'MONDAY', text: 'Poniedziałek' },
  { id: 'TUESDAY', text: 'Wtorek' },
  { id: 'WEDNESDAY', text: 'Środa' },
  { id: 'THURSDAY', text: 'Czwartek' },
  { id: 'FRIDAY', text: 'Piątek' },
  { id: 'SATURDAY', text: 'Sobota' },
  { id: 'SUNDAY', text: 'Niedziela' },
];

export const weekdayName = (id: string) => weekdayOption.find((option) => option.id === id)?.text ?? id;
