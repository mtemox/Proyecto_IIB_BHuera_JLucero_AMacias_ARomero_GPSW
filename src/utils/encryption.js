// src/utils/encryption.js
import CryptoJS from 'crypto-js';

// Función para encriptar datos
export const encryptData = (data, secretKey) => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

// Función para desencriptar datos
export const decryptData = (encryptedData, secretKey) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};