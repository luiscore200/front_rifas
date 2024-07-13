import { useEffect, useState } from "react";
import { User,phoneCode,premio,rifa } from "../config/Interfaces";
import { getToken } from "./auth";




const API_URL =  'http://192.168.1.83:3000';  // Reemplaza con la IP local de tu máquina de desarrollo
const clientId = '6j7o172o1igbijpahv863124k4';
const clientSecret = '3ut8ugb2k65elqh6mjnv91dmceb2ch0v8f7p7hgiiafd8b1fig0';
const apiKey = '7PP43c0YC159GhcDrBdhvLYILOeGdxv5sUVt9oIh';
const oauthUrl = 'https://oauth.sandbox.nequi.com/oauth2/token';
const cashInUrl = 'https://api.sandbox.nequi.com/agents/v2/-services-cashinservice-cashin';




const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number = 5000): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('Request timed out')), timeout))
  ]);
};

export const login = async (email: string, password: string) => {
  const user = { email: email, password: password };
 // console.log('Sending login request:', user);
  try {
    const response = await fetchWithTimeout(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();

    if (!response.ok) {
      return data;
    }
    if (data.access_token) {
      console.log('Login successful');
      return data;
    } else {
      return data;
    }
  } catch (error:any) {
    throw error;
  }
};

export const register = async (user:User) => {
  const user2 = {
    name:user.name,
    domain:user.domain,
    email:user.email,
    phone:user.phone,
    country:user.country,
    password:user.password,
    status: user.status == 'Active'? true:false ,
    payed:user.payed,
   }
   console.log(user2.status);
    try {
      const response = await fetchWithTimeout(`${API_URL}/auth/register`, {
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
      throw error;
    }
  };
  
export const userIndex = async ()=>{
  try{
    const response = await fetchWithTimeout(`${API_URL}/user/index`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getToken()}`, 
      },
    });
    if (response.ok) {
      const users2:User[] = await response.json();
    return users2;
    }else{
      return response.json();
    }
  }catch(error:any){
    throw error;
  }
}

export const userUpate = async (user:User) => {
const user2 = {
  name:user.name,
  domain:user.domain,
  email:user.email,
  phone:user.phone,
  country:user.country,
  role:user.role,
  status:user.status == 'Active'? true:false ,
  payed:user.payed,
 }
  try {
    const response = await fetchWithTimeout(`${API_URL}/user/update/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getToken()}`, 
      },
      body: JSON.stringify(user2),
    });
    const data = await response.json();
    if (!response.ok) {
      return data;
    }
    return data;
  } catch (error:any) {
    throw error;
  }
};

export const userCreate = async (user:User) => {
  
const user2 = {
  name:user.name,
  domain:user.domain,
  email:user.email,
  phone:user.phone,
  country:user.country,
  password:user.password,
  status: user.status == 'Active'? true:false ,
 }
 console.log(user2.status);

  try {
    const response = await fetchWithTimeout(`${API_URL}/user/store`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getToken()}`, 
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
    throw error;
  }
};

export const userDelete = async (id:number) => {
    try {
      const response = await fetchWithTimeout(`${API_URL}/user/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`, 
        },
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        return data;
      }
      return data;
    } catch (error:any) {
      throw error;
    }
  }

  export const phoneCodeIndex = async ()=>{
    try{
      const response = await fetchWithTimeout(`${API_URL}/utils/phoneCode`, {
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
      throw error;
    }
  }

  export const rifaCreate = async (obj:any) => {
  
      try {
        const response = await fetchWithTimeout(`${API_URL}/rifa/store`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getToken()}`, 
          },
          body: JSON.stringify(obj),
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
          return data;
        }
        return data;
      } catch (error:any) {
        throw error;
      }
    };
    
  export const indexRifa = async ()=>{
  
    try{
      const response = await fetchWithTimeout(`${API_URL}/rifa/index`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`, 
        },
      });
      if (response.ok) {
        const rifa:rifa[] = await response.json();
        console.log(rifa);
      return rifa;
      }else{
        return response.json();
      }
      
    }catch(error:any){
     
      throw error;
     
    }

   
  };
  export const rifaFind = async (id:number)=>{
  
    try{
      const response = await fetchWithTimeout(`${API_URL}/rifa/find/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`, 
        },
      });
      if (response.ok) {
        const rifa:rifa[] = await response.json();
        console.log(rifa);
      return rifa;
      }else{
        return response.json();
      }
      
    }catch(error:any){
     
      throw error;
     
    }

   
  }
      
  export const rifaDelete = async (id:number)=>{
    try{
      const response = await fetchWithTimeout(`${API_URL}/rifa/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`, 
        },
      });
      if (response.ok) {
        const rifa = await response.json();
        console.log(rifa);
      return rifa;
      }else{
        return response.json();
      }
    }catch(error:any){
      throw error;
    }
  }
  
export const rifaUpdate = async (obj:rifa) => {
    
    try {
      const response = await fetchWithTimeout(`${API_URL}/rifa/update/${obj.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`, 
        },
        body: JSON.stringify(obj),
      });
  
      const data = await response.json();
      if (!response.ok) {
        return data;
      }
      return data; 
    } catch (error:any) {
      throw error;
        }
  };

  export const rifaAssign = async (id:number) => {
    
    try{
      const response = await fetchWithTimeout(`${API_URL}/rifa/getNumeros/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`, 
        },
      });
      if (response.ok) {
        const rifa:any = await response.json();
        console.log(rifa);
      return rifa;
      }else{
        return response.json();
      }
      
    }catch(error:any){
     
      throw error;
     
    }

  };

  export const createComprador = async (comprador:any)=>{

    try {
      const response = await fetchWithTimeout(`${API_URL}/comprador/store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`, 
        },
        body: JSON.stringify(comprador),
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        return data;
      }
      return data;
    } catch (error:any) {
      throw error;
    }
  };

  export const assignNumbers = async (id_rifa:number,id_comprador:number,numbers:number[],method:string)=>{

    

    try {
      const response = await fetchWithTimeout(`${API_URL}/rifa/assignNumbers/${id_rifa}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`, 
        },
        body: JSON.stringify({id_comprador:id_comprador,numbers:numbers,method:method}),
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        return data;
      }
      return data;
    } catch (error:any) {
      throw error;
    }
  };

  export const indexSeparated = async(id:number)=>{
    try{
      const response = await fetchWithTimeout(`${API_URL}/rifa/getSeparated/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`, 
        },
      });
      if (response.ok) {
        const assigns = await response.json();
      return assigns;
      }else{
        return response.json();
      }
    }catch(error:any){
      throw error;
    } 
  }
  
  export const deleteSeparated = async(id:number)=>{
    try{
      const response = await fetchWithTimeout(`${API_URL}/rifa/deleteSeparated/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`, 
        },
      });
      if (response.ok) {
        const assigns = await response.json();
      return assigns;
      }else{
        return response.json();
      }
    }catch(error:any){
      throw error;
    } 
  }

  export const confirmSeparated = async(id:number)=>{
    try{
      const response = await fetchWithTimeout(`${API_URL}/rifa/confirmSeparated/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`, 
        },
      });
      if (response.ok) {
        const assigns = await response.json();
      return assigns;
      }else{
        return response.json();
      }
    }catch(error:any){
      throw error;
    } 
  }

  
  export const updateWinner = async(id:number,premios:premio[],index:number)=>{
    const body={index,premios};
    try{
      
      const response = await fetchWithTimeout(`${API_URL}/rifa/confirmWinner/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`, 
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        const assigns = await response.json();
      return assigns;
      }else{
        return response.json();
      }
    }catch(error:any){
      throw error;
    } 
  }



  export const sendQr = async()=>{
    try{
      const response = await fetchWithTimeout(`${API_URL}/user/config/sendQr`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`, 
        },
      });
      if (response.ok) {
        const assigns = await response.json();
      return assigns;
      }else{
        return response.json();
      }
    }catch(error:any){
      throw error;
    } 
  }


  export const verifySession = async()=>{
    try{
      const response = await fetchWithTimeout(`${API_URL}/user/config/verifyQr`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`, 
        },
      });
      if (response.ok) {
        const assigns = await response.json();
      return assigns;
      }else{
        return response.json();
      }
    }catch(error:any){
      throw error;
    } 
  }

  export const importConfig = async()=>{
    try{
      const response = await fetchWithTimeout(`${API_URL}/user/config/export`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`, 
        },
      });
      if (response.ok) {
        const assigns = await response.json();
      return assigns;
      }else{
        return response.json();
      }
    }catch(error:any){
      throw error;
    } 
  }

  export const verifyEmail = async(email:string,password:string)=>{
    const body={email,password};
    try{
      
      const response = await fetchWithTimeout(`${API_URL}/user/config/verifyEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`, 
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        const assigns = await response.json();
      return assigns;
      }else{
        return response.json();
      }
    }catch(error:any){
      throw error;
    } 
  }

  export const saveConfig = async(obj:any)=>{
   
    try{
      
      const response = await fetchWithTimeout(`${API_URL}/user/config/saveConfig`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`, 
        },
        body: JSON.stringify(obj),
      });
      if (response.ok) {
        const assigns = await response.json();
      return assigns;
      }else{
        return response.json();
      }
    }catch(error:any){
      throw error;
    } 
  }

  
  export const saveAdminConfig = async(obj:any)=>{
   
    try{
      
      const response = await fetchWithTimeout(`${API_URL}/admin/config/saveConfig`, {
        method: 'POST',
       body: obj,
       headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${await getToken()}`, 
  },
      });
      if (response.ok) {
        const assigns = await response.json();
      return assigns;
      }else{
        return response.json();
      }
    }catch(error:any){
      throw error;
    } 
  }

  
  export const importAdminConfig = async()=>{
    try{
      const response = await fetchWithTimeout(`${API_URL}/admin/config/loadConfig`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`, 
        },
      });
      if (response.ok) {
        const assigns = await response.json();
      return assigns;
      }else{
        return response.json();
      }
    }catch(error:any){
      throw error;
    } 
  }

  export const generalConfig = async()=>{
    try{
      const response = await fetchWithTimeout(`${API_URL}/generalConfig`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
         
        },
      });
      if (response.ok) {
        const assigns = await response.json();
      return assigns;
      }else{
        return response.json();
      }
    }catch(error:any){
      throw error;
    } 
  }








  /////////////////////////////////////////////////////////////////////////////////////////////

  export  const getNequiToken = async () => {
      const authString = `${clientId}:${clientSecret}`;
      console.log(authString);
      const authHeader = `Basic ${btoa(authString)}`;
     console.log(authHeader);  
      try {
        const response = await fetch(oauthUrl + '?grant_type=client_credentials', {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
    
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error_description || 'Error getting access token');
        }
    
        return data.access_token;
      } catch (error) {
        console.error('Error getting access token:', error);
        throw error;
      }
    };
    
  export const cashInNequi = async (accessToken:string, phoneNumber:number, amount:any) => {
      const payload = {
        phoneNumber,
        amount
      };
    
      try {
        const response = await fetch(cashInUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'x-api-key': apiKey
          },
          body: JSON.stringify(payload)
        });
    
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Error making Cash In');
        }
    
        return data;
      } catch (error) {
        console.error('Error making Cash In:', error);
        throw error;
      }
    };

    export const validateClientAndAmount = async (token: string, phone: any,amount:any) => {
      try {
        const requestBody = {
          phone_number: Number(phone),
          value: amount
        };

        const response = await fetch('https://api.sandbox.nequi.com/agents/v2/-services-clientservice-validateclient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify(requestBody)
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response data:', errorData);
          throw new Error(`Error validating client and amount: ${response.status} ${response.statusText}`);
        }
    
        const data = await response.json();
        return data; // Aquí retornas lo que necesites de la respuesta
      } catch (error) {
        console.error('Error validating client and amount:', error);
        throw error;
      }
    };
    
    
    
    export const main = async () => {
      try {
        const accessToken = await getNequiToken();
        console.log(accessToken);
        const validate = await cashInNequi(accessToken, 3177229993, 2000);
        console.log("cashIn:  ",validate);
      
      } catch (error) {
        console.error('Error:', error);
      }
    };

    