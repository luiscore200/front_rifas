export interface User {
    id?:number
    name: string;
    domain:string;
    phone:string;
    email: string;
    country:string;
    status?: string;
    role?:string;
    password?:string;
    // ... other user properties
  }

export interface phoneCode{
  id:number,
  code:string,
  name:string,
}

export interface premio{
  id:number;
  descripcion:string;
  loteria:string;
  fecha:string;
}

export interface rifa {
  id?:number,
  titulo: string;
  pais: string;
  imagen?:string;
  precio:number;
  tipo: string;
  numeros: string;
  premios?:premio[];
}
