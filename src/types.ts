export type UserType = 'Cliente' | 'Corretor de Imóveis';
export type AttendantName = 'Beth' | 'Otalivio' | 'Paulo' | 'Ribera' | 'Atendimento';

export interface Tenant {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  isPrincipal: boolean;
}

export interface Property {
  cep: string;
  number: string;
  complement: string;
  type: 'Casa' | 'Apartamento' | 'Sala/Salão' | 'Galpão';
  flexCode: string;
}

export interface Values {
  rent: string;
  iptu: string;
  condo: string;
}
