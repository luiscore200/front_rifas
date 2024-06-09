import { User,phoneCode } from "../config/Interfaces";

const API_URL =  'http://192.168.1.83:3000';  // Reemplaza con la IP local de tu máquina de desarrollo

export const login = async (email: string, password: string) => {
  const user = { email: email, password: password };
 // console.log('Sending login request:', user);
  try {
    const response = await fetch(`${API_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();

    if (!response.ok) {
      return data.mensaje;
    }
    if (data.access_token) {
      console.log('Login successful');
      return data;
    } else {
      return data;
    }
  } catch (error:any) {
   return error;
  }
};

export const userIndex = async ()=>{
  try{
    const response = await fetch(`${API_URL}/user/index`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    
    });

    if (response.ok) {
      const users2:User[] = await response.json();
    return users2;
    }else{
      return response.json();
    }
   

  }catch(error:any){
    return error;
  }
}


export const userUpate = async (user:User) => {
  

const user2 = {
  name:user.name,
  domain:user.domain,
  email:user.email,
  country:user.country,
  role:user.role,
  status:user.status == 'Active'? true:false ,
 }


  try {
    const response = await fetch(`${API_URL}/user/update/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user2),
    });

    const data = await response.json();

    if (!response.ok) {
      return data;
    }
    return data;
   
  } catch (error:any) {
   return error;
  }
};


export const userCreate = async (user:User) => {
  

const user2 = {
  name:user.name,
  domain:user.domain,
  email:user.email,
  country:user.country,
  password:user.password,
  status: user.status == 'Active'? true:false ,
 }
 console.log(user2.status);


  try {
    const response = await fetch(`${API_URL}/user/store`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user2),
    });

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      return data;
    }
    return data;
   
  } catch (error:any) {
   return error;
  }
};



export const userDelete = async (id:number) => {
  

 
  
    try {
      const response = await fetch(`${API_URL}/user/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      console.log(data);
  
      if (!response.ok) {
        return data;
      }
      return data;
     
    } catch (error:any) {
     return error;
    }
  }


  export const phoneCodeIndex = async ()=>{
  

    try{
      const response = await fetch(`${API_URL}/utils/phoneCode`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      
      });
  
      if (response.ok) {
        const users2:phoneCode[] = await response.json();
      return users2;
      }else{
        return response.json();
      }
     
  
    }catch(error:any){
      return error;
    }
  }
  