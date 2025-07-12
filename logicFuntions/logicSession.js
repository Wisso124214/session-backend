import axios from 'axios';
import { SERVER_URL } from '../config.js';
import crypto from 'crypto';

// Función para cerrar sesión
export const closeSession = async (
  setStrPage,
  setIdMainSession,
  idMainSession
) => {
  if (idMainSession !== '') {
    // Verifica si hay una sesión abierta
    axios
      .put(`${SERVER_URL}/session/${idMainSession}`, {
        state: 'closed', // Cambia el estado de la sesión a "cerrado"
        date: new Date(Date.now()).toString(), // Registra la fecha actual
      })
      .then(async () => {
        setIdMainSession(''); // Limpia el ID de la sesión principal
        setStrPage('login'); // Redirige a la página de inicio de sesión
      })
      .catch((error) => {
        handleError(error, 'Error closing session'); // Maneja errores
      });
  } else {
    console.log('We does not found an open session'); // Mensaje si no hay sesión abierta
  }
};

// Función para crear una sesión
export const createSession = async (id_user) => {
  let strId = '';

  await getIdSession(id_user) // Obtiene el ID de la sesión
    .then(async (id_session) => {
      strId = id_session;

      await setSession(id_user, 'open', strId).then(async (id_session) => {
        strId = id_session; // Actualiza el ID de la sesión
      });
    })
    .catch((error) => {
      handleError(error, 'Error setting session'); // Maneja errores
    });

  return strId; // Devuelve el ID de la sesión
};

// Función para obtener el ID de una sesión
export const getIdSession = async (id_user) => {
  let strId = '';

  await axios
    .get(`${SERVER_URL}/sessions`, {
      params: {
        id_user: id_user, // Pasa el ID del usuario como parámetro
        // id_device: id_device, // Incluye el ID del dispositivo
      },
    })
    .then(async (res) => {
      await res.data.forEach((objsession) => {
        // Busca una sesión que coincida con el usuario y dispositivo
        if (
          objsession.id_user === id_user
          // && objsession.id_device === id_device
        ) {
          strId = objsession._id; // Asigna el ID de la sesión
        }
      });
    })
    .catch((error) => {
      handleError(error, 'Error setting session'); // Maneja errores
      return error;
    });

  return strId; // Devuelve el ID de la sesión
};

// Función para configurar una sesión
export const setSession = async (id_user, state, id_session) => {
  let strId = '';

  const date_4 = new Date(); // Obtiene la fecha actual
  date_4.setHours(date_4.getHours() - 4); // Ajusta la hora a GMT-4

  const objsession = {
    // id_device: id_device, // ID del dispositivo
    id_user: id_user, // ID del usuario
    state: state, // Estado de la sesión
    date: date_4, // Fecha ajustada
  };

  if (id_session === '') {
    // Si no hay ID de sesión, crea una nueva
    await axios
      .post(`${SERVER_URL}/session`, objsession)
      .then((res) => {
        strId = res.data._id; // Asigna el ID de la nueva sesión
      })
      .catch((error) => {
        handleError(error, 'Error setting session'); // Maneja errores
      });
  } else if (method === 'put') {
    // Si hay ID de sesión, actualiza la existente
    await axios
      .put(`${SERVER_URL}/session/${id_session}`, objsession)
      .catch((error) => {
        handleError(error, 'Error setting session'); // Maneja errores
      });
    strId = id_session; // Asigna el ID de la sesión existente
  }
  return strId; // Devuelve el ID de la sesión
};

// Función para cifrar datos
export function encryptData(data) {
  // Genera un IV (vector de inicialización) aleatorio de 16 bytes
  const iv = crypto.generateRandomIV(16);
  // Genera una clave hash SHA-256 de longitud 32 bytes
  const key = crypto.getHashSha256('1029jh01d3n9ioqwuhr97823h', 32);
  // Cifra los datos usando la clave y el IV
  const encryptedData = crypto.encrypt(data, key, iv);
  return encryptedData; // Devuelve los datos cifrados
}

// Función para obtener una lista de nombres de usuario
export async function getListUsernames(setListUsernames, username) {
  await axios
    .get(`${SERVER_URL}/users`, { params: { username: username } }) // Solicita usuarios al servidor
    .then(async (res) => {
      let arr = [];
      // Itera sobre los datos recibidos y extrae los nombres de usuario
      await res.data.forEach((objusername) => {
        arr.push(objusername.username);
      });
      setListUsernames(arr); // Actualiza la lista de nombres de usuario
    })
    .catch((error) => {
      handleError(error, 'Error getting users'); // Maneja errores
    });
}

// Función para obtener el ID de un usuario
export const getIdUser = async (username) => {
  let id = '';

  await axios
    .get(`${SERVER_URL}/users`, { params: { username: username } }) // Solicita usuarios al servidor
    .then(async (res) => {
      await res.data.forEach((objuser) => {
        // Busca un usuario que coincida con el nombre de usuario
        if (objuser.username === username && id === '') {
          id = objuser._id; // Asigna el ID del usuario
        }
      });
    })
    .catch((error) => {
      handleError(error, 'Error getting users'); // Maneja errores
    });
  return id; // Devuelve el ID del usuario
};

// Función para obtener el ID de un contacto
export const getIdContact = async (email) => {
  let id = '';

  await axios
    .get(`${SERVER_URL}/contacts`, { params: { email: email } }) // Solicita contactos al servidor
    .then(async (res) => {
      await res.data.forEach((objcontact) => {
        // Busca un contacto que coincida con el correo electrónico
        if (objcontact.email === email && id === '') {
          id = objcontact._id; // Asigna el ID del contacto
        }
      });

      if (id === '') {
        // Si no se encuentra el contacto, lo crea
        await axios
          .post(`${SERVER_URL}/contact`, {
            email: email, // Crea un nuevo contacto con el correo electrónico
          })
          .catch((error) => {
            handleError(error, 'Error getting contacts'); // Maneja errores
          });
        id = await getIdContact(email); // Vuelve a buscar el ID del contacto
      }
    })
    .catch((error) => {
      handleError(error, 'Error getting contacts'); // Maneja errores
    });
  return id; // Devuelve el ID del contacto
};

// Función para guardar datos de registro
export const saveDataRegister = async (username, password, email, data) => {
  const id_contact = await getIdContact(email); // Obtiene el ID del contacto

  const {
    setIsKeyboardVisible, // Función para ocultar el teclado
    setListUsernames, // Función para actualizar la lista de nombres de usuario
    listUsernames, // Lista actual de nombres de usuario
    setLoading, // Función para actualizar el estado de carga
    mode, // Modo de la aplicación
    theme, // Tema de la aplicación
    methods, // Métodos adicionales
  } = data;

  setIsKeyboardVisible(false); // Oculta el teclado

  setListUsernames([...listUsernames, username]); // Agrega el nuevo nombre de usuario a la lista

  const hashedPassword = await encryptData(password); // Cifra la contraseña

  await axios
    .post(`${SERVER_URL}/user`, {
      // id_device: id_device, // ID del dispositivo
      username: username, // Nombre de usuario
      password: hashedPassword, // Contraseña cifrada
      id_contact: id_contact, // ID del contacto
    })
    .then(async (objuser) => {
      createSession(objuser.data._id) // Crea una sesión para el usuario
        .then(async (id_session) => {
          methods.setIdMainSession(id_session); // Establece el ID de la sesión principal
        })
        .catch((error) => {
          methods.setLoading(false); // Detiene el estado de carga
          handleError(error, 'Error Registering'); // Maneja errores
        });
    })
    .catch((error) => {
      methods.setLoading(false); // Detiene el estado de carga
      handleError(error, 'Error Registering'); // Maneja errores
    });
};

// Función para manejar errores
export const handleError = (error, errString) => {
  console.log(errString); // Muestra el mensaje de error
};
