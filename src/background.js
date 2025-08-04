// public/background.js
// src/background.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import CryptoJS from 'crypto-js';


// --- Configuración de Firebase (copia y pega la de tu archivo firebase.js) ---
const firebaseConfig = {
    apiKey: "AIzaSyB-onucGGtYAfpD9wfdin8qttPCepUTjNA",
    authDomain: "keyplus-a9573.firebaseapp.com",
    projectId: "keyplus-a9573",
    storageBucket: "keyplus-a9573.firebasestorage.app",
    messagingSenderId: "768609595455",
    appId: "1:768609595455:web:1fcefab948cb944fb4088a",
    measurementId: "G-M5PK6VC6Q6"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- Función de desencriptación ---
function decryptData(encryptedData, key) {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        console.error("Error al desencriptar:", e);
        return null;
    }
}

// --- Lógica Principal del Listener ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_CREDENTIALS') {

        // PISTA 3: ¿El cerebro recibió el mensaje?
        console.log('[Key+ Background] Mensaje GET_CREDENTIALS recibido para URL:', request.url);

        handleGetCredentials(request.url)
            .then(sendResponse)
            .catch(error => {
                console.error("Error al obtener credenciales:", error);
                sendResponse(null);
            });
        return true; // Indica respuesta asíncrona
    }
});

// Función para obtener el usuario actual de forma asíncrona
function getCurrentUser() {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            unsubscribe(); // Nos desuscribimos para no tener listeners abiertos
            resolve(user);
        }, reject);
    });
}

async function handleGetCredentials(pageUrl) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        // PISTA 4: ¿El usuario está logueado?
        console.error('[Key+ Background] ¡Fallo! Usuario no autenticado.');
        console.log("Usuario no autenticado en el background.");
        return null;
    }

    try {
        const url = new URL(pageUrl);
        const hostname = url.hostname.replace('www.', '');

        // PISTA 5: ¿Qué hostname estamos buscando en la BD?
        console.log(`[Key+ Background] Buscando credenciales para el hostname: '${hostname}'`);

        const credentialsRef = collection(db, 'credentials');
        const q = query(
            credentialsRef,
            where('userId', '==', currentUser.uid),
            where('url', '==', hostname)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            // PISTA 6: ¿Se encontraron resultados?
            console.warn(`[Key+ Background] No se encontraron documentos en Firestore para '${hostname}'.`);
            console.log(`No se encontraron credenciales para ${hostname}`);
            return null;
        }

        const doc = querySnapshot.docs[0];
        const data = doc.data();

        const decryptedPassword = decryptData(data.password, currentUser.uid);
        if (!decryptedPassword) {
            console.error("La desencriptación falló.");
            return null;
        }

        return {
            email: data.email,
            password: decryptedPassword
        };
    } catch (error) {
        console.error("Error en la consulta a Firestore:", error);
        return null;
    }
}