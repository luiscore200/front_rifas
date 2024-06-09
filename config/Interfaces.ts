export interface User {
    id?:number
    name: string;
    domain:string;
    email: string;
    country:string;
    status: string;
    role?:string;
    password?:string;
    // ... other user properties
  }

export interface rifa{
    titulo:string,
    pais:string,
    tipo:string,
    numeros:number
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