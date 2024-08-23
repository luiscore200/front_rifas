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
    payed?:boolean;
    id_suscription?:string;
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
  ganador:string;
}

export interface rifa {
  id?:number;
  titulo: string;
  pais: string;
  imagen?:string;
  precio:number;
  tipo: string;
  numeros: string;
  asignaciones?:string;
  premios?:premio[];
}

export interface subs {
  id?:number;
  name:string;
  sub_id:string;
  url:string;
  image:string;
  max_raffle:string;
  max_num:string;
  whatsapp:boolean;
  email:boolean;
  banners:boolean;
  share:boolean;
}