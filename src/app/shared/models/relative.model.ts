export enum RelativeKind {
  MOTHER = 'Мать',
  FATHER = 'Отец',
  UNCLE = 'Дядя',
  AUNT = 'Тетя',
  GRANDPA = 'Дедушка',
  GRANDMA = 'Бабушка',
}

export interface Relative {
  id?: string;
  name: string;
  surname: string;
  fatherName?: string;
  number: number;
  kind: RelativeKind;
}
