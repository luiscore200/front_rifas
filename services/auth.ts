import { setStorageItemAsync, getStorageItemAsync, clearStorageAsync } from './storage';
import { decode as atob } from 'base-64';

export const saveLocalStorage = async (resp: any) => {
  if (resp.access_token && resp.user) {
    try {
      await setStorageItemAsync('access_token', resp.access_token);
      await setStorageItemAsync('user', JSON.stringify(resp.user));
      return true;
    } catch (error) {
      console.error('Error saving data', error);
      return false;
    }
  }
  return false;
};

export const getToken = async () => {
  try {
    const token = await getStorageItemAsync('access_token');
    return token ?? '';
  } catch (error) {
    console.error('Error retrieving token', error);
    return '';
  }
};

export const getUser = async () => {
  try {
    const user = await getStorageItemAsync('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error retrieving user', error);
    return null;
  }
};

export const isAuthenticated = async () => {
  try {
    const token = await getToken();
     
    if (!token) return false;

    const expiration = (JSON.parse(atob(token.split('.')[1]))).exp;
    if (Math.floor((new Date).getTime() / 1000) >= expiration) {
      await logout();
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error('Error checking authentication', error);
    return false;
  }
};

export const logout = async () => {
  try {
    await clearStorageAsync();
  } catch (error) {
    console.error('Error during logout', error);
  }
};
