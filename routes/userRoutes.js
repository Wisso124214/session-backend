import axios from 'axios';
import bcrypt from 'bcrypt';
import { SERVER_URL } from '../config.js';
import jwt from 'jsonwebtoken'

const secretKey = 'abcde12345';
let tokens = []; // Array to store tokens
let info = {
  infoUsers: [],
};

export const createUserRoutes = async (app) => {
  // app.get('/test-db', async (req, resp) => {
  //   //Evaluar permisos
  //   axios.post(`${SERVER_URL}/session`,
  //     {
  //       date: new Date(),
  //     }
  //   )
  //   .then((res) => {
  //     console.log('posted');
  //     //console.log('posted', res.data, 'id: ', res.data._id);
  //     resp.status(200).json({ message: 'Session created successfully', sessionId: res.data._id });
  //   })
  //   .catch((err) => {
  //     console.log('error posting', JSON.stringify(err, null, 2));
  //     resp.status(500).json({ message: err.message });
  //   })
  // });

  app.get('/get-contacts', async (req, res) => {
    axios
      .get(`${SERVER_URL}/contacts`)
      .then((axiosRes) => {
        res.json(axiosRes.data);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
        console.log(JSON.stringify(error, null, 2));
      });
  });

  app.get('/get-contact/:id', async (req, res) => {
    axios
      .get(`${SERVER_URL}/contact/${req.params.id}`)
      .then((axiosRes) => {
        res.json(axiosRes.data);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
        console.log(JSON.stringify(error, null, 2));
      });
  });

  app.post('/post-contact', async (req, res) => {
    axios
      .post(`${SERVER_URL}/contact`, req.body)
      .then((axiosRes) => {
        res.json(axiosRes.data);
      })
      .catch((error) => {
        res.status(402).json({ message: error.message });
        console.log(JSON.stringify(error, null, 2));
      });
  });

  app.put('/update-contact/:id', async (req, res) => {
    axios
      .put(`${SERVER_URL}/contact/${req.params.id}`, req.body)
      .then((axiosRes) => {
        res.json(axiosRes.data);
      })
      .catch((error) => {
        res.status(405).json({ message: error.message });
        console.log(JSON.stringify(error, null, 2));
      });
  });

  app.delete('/delete-contact/:id', async (req, res) => {
    axios
      .delete(`${SERVER_URL}/contact/${req.params.id}`)
      .then((axiosRes) => {
        res.json(axiosRes.data);
      })
      .catch((error) => {
        res.status(406).json({ message: error.message });
        console.log(JSON.stringify(error, null, 2));
      });
  });
  /////////////////////////////////////////////////

  app.get('/get-sessions', async (req, res) => {
    axios
      .get(`${SERVER_URL}/sessions`)
      .then((axiosRes) => {
        res.json(axiosRes.data);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
        console.log(JSON.stringify(error, null, 2));
      });
  });

  app.post('/post-session', async (req, res) => {
    axios
      .post(`${SERVER_URL}/session`, req.body)
      .then((axiosRes) => {
        res.json(axiosRes.data);
      })
      .catch((error) => {
        res.status(402).json({ message: error.message });
        console.log(JSON.stringify(error, null, 2));
      });
  });

  app.put('/update-session/:id', async (req, res) => {
    axios
      .put(`${SERVER_URL}/session/${req.params.id}`, req.body)
      .then((axiosRes) => {
        res.json(axiosRes.data);
      })
      .catch((error) => {
        res.status(405).json({ message: error.message });
        console.log(JSON.stringify(error, null, 2));
      });
  });

  app.delete('/delete-session/:id', async (req, res) => {
    axios
      .delete(`${SERVER_URL}/session/${req.params.id}`)
      .then((axiosRes) => {
        res.json(axiosRes.data);
      })
      .catch((error) => {
        res.status(406).json({ message: error.message });
        console.log(JSON.stringify(error, null, 2));
      });
  });

  ////////////////////////////////////////////////////////////////

  app.get('/get-users', async (req, res) => {
    axios
      .get(`${SERVER_URL}/users`)
      .then((axiosRes) => {
        res.json(axiosRes.data);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
        console.log(JSON.stringify(error, null, 2));
      });
  });

  app.post('/post-user', async (req, res) => {
    axios
      .post(`${SERVER_URL}/user`, req.body)
      .then((axiosRes) => {
        res.json(axiosRes.data);
      })
      .catch((error) => {
        res.status(402).json({ message: error.message });
        console.log(JSON.stringify(error, null, 2));
      });
  });

  app.put('/update-user/:id', async (req, res) => {
    axios
      .put(`${SERVER_URL}/user/${req.params.id}`, req.body)
      .then((axiosRes) => {
        res.json(axiosRes.data);
      })
      .catch((error) => {
        res.status(405).json({ message: error.message });
        console.log(JSON.stringify(error, null, 2));
      });
  });

  app.delete('/delete-user/:id', async (req, res) => {
    axios
      .delete(`${SERVER_URL}/user/${req.params.id}`)
      .then((axiosRes) => {
        res.json(axiosRes.data);
      })
      .catch((error) => {
        res.status(406).json({ message: error.message });
        console.log(JSON.stringify(error, null, 2));
      });
  });

  app.get('/get-id-contact', async (req, res) => {
    const { contact, counter } = req.query  || req.body;
    let id = '';
    let thisCounter = parseInt(counter, 10) || 0;

    if (!contact) {
      handleError(new Error('Contact is required'), 'Error getting contact ID'); // Maneja errores
      return res.status(400).json({ message: 'Contact is required' });
    }

    if (thisCounter > 10) {
      handleError(new Error('Too many circular requests'), 'Error getting contact ID'); // Maneja errores
      return res.status(429).json({ message: 'Too circular requests, please check the /get-id-contact route to fix it.' });
    }

    await axios
      .get(`${SERVER_URL}/contacts`, { params: { contact: contact } }) // Solicita contactos al servidor
      .then(async (axiosRes) => {
        await axiosRes.data.forEach((objcontact) => {
          // Busca un contacto que coincida con el correo electrónico
          if (objcontact.contact === contact && id === '') {
            id = objcontact._id; // Asigna el ID del contacto
          }
        });

        if (id === '') {
          // Si no se encuentra el contacto, lo crea
          await axios
            .post(`${SERVER_URL}/contact`, {
              contact: contact, // Crea un nuevo contacto con el correo electrónico
            })
            .catch((error) => {
              handleError(error, 'Error getting contacts'); // Maneja errores
              res.status(500).json({ message: error.message, error });
            });
          id = await axios
            .get(`${SERVER_URL}/get-id-contact`, { params: { contact: contact, counter: thisCounter + 1 } })
            .then((response) => response.data.id)
            .catch((error) => {
              handleError(error, 'Error getting contact ID'); // Maneja errores
              res.status(500).json({ message: error.message, error });
            });
        }
      })
      .catch((error) => {
        handleError(error, 'Error getting contacts'); // Maneja errores
        res.status(500).json({ message: error.message, error });
      });
      res.json({ id: id });
  });

  app.get('/encrypt-data', async (req, res) => {
    const { data } = req.query || req.body;

    if (!data) {
      return res.status(400).json({ message: 'Data is required for encryption' });
    }

    const saltRounds = 10; 
    const salt = bcrypt.genSaltSync(saltRounds); // Genera un salt
    const encryptedData = bcrypt.hashSync(data, salt); // Cifra los datos con el salt
    res.json({ encryptedData }); // Devuelve los datos cifrados
  });

  app.get('/get-id-session', async (req, res) => {
    const { id_user } = req.body || req.query; // Obtiene el ID del usuario de los parámetros de la consulta
    
    const strId = await axios
      .get(`${SERVER_URL}/sessions`, {
        params: {
          id_user: id_user, // Pasa el ID del usuario como parámetro
        },
      })
      .then(async (axiosRes) => {
        await axiosRes.data.forEach((objsession) => {
          // Busca una sesión que coincida con el usuario y dispositivo
          if (
            objsession.id_user === id_user
            // && objsession.id_device === id_device
          ) {
            return objsession._id; // Asigna el ID de la sesión
          }
        });
      })
      .catch((error) => {
        handleError(error, 'Error setting session'); // Maneja errores
        res.status(500).json({ message: error.message, error });
      });

    res.json({ id: strId }); // Devuelve el ID de la sesión
  });

  app.post('/create-session', async (req, res) => {
    let strId = '';
    const { id_user } = req.body || req.query;

    if (!id_user) {
      handleError(new Error('id_user is required'), 'Error creating session. No id_user available'); // Maneja errores
      return res.status(400).json({ message: 'id_user is required' });
    }

    await axios.post(`${SERVER_URL}/session`, {
          id_user,
          session_state: 'open',
          date: new Date(), // Fecha actual
        })
        .then(async (id_session_res) => {
          strId = id_session_res.data._id; // Actualiza el ID de la sesión
          return res.json({ id: strId }); // Devuelve el ID de la sesión
        })
        .catch((error) => {
          handleError(error, 'Error setting session'); // Maneja errores
          return res.status(500).json({ message: error.message, error });
        });
  });

  app.put('/put-set-session', async (req, res) => {
    let strId = '';
    const { id_user, session_state, id_session } = req.body || req.query;
    
    if (!id_user || !session_state || !id_session) {
      handleError(new Error('id_user, state, and id_session are required'), 'Error setting session'); // Maneja errores
      return res.status(400).json({ message: 'id_user, state, and id_session are required' });
    }

    const date_4 = new Date(); // Obtiene la fecha actual
    date_4.setHours(date_4.getHours() - 4); // Ajusta la hora a GMT-4

    const objsession = {
      // id_device: id_device, // ID del dispositivo
      id_user: id_user, // ID del usuario
      session_state: session_state, // Estado de la sesión
      date: date_4, // Fecha ajustada
    };

    if (id_session === '') {
      // Si no hay ID de sesión, crea una nueva
      await axios
        .post(`${SERVER_URL}/session`, objsession)
        .then((axiosRes) => {
          strId = axiosRes.data._id; // Asigna el ID de la nueva sesión
        })
        .catch((error) => {
          handleError(error, 'Error setting session'); // Maneja errores
          res.status(500).json({ message: error.message, error });
        });
    } else {
      // Si hay ID de sesión, actualiza la existente
      await axios
        .put(`${SERVER_URL}/session/${id_session}`, objsession)
        .catch((error) => {
          handleError(error, 'Error setting session'); // Maneja errores
          res.status(500).json({ message: error.message, error });  
        });
      strId = id_session; // Asigna el ID de la sesión existente
    }
    res.json({ id: strId }); // Devuelve el ID de la sesión
  });

  app.post('/register', async (req, res) => {
    const {
      username,
      password,
      contact,
    } = req.body || req.query;

    if (!username || !password || !contact) {
      return res.status(400).json({ message: 'Username, password, and contact are required' });
    }

    const id_contact = await axios
      .get(`${SERVER_URL}/get-id-contact`, { params: { contact: contact } })
      .then((response) => response.data.id)
      .catch((error) => {
        handleError(error, 'Error getting contact ID'); // Maneja errores
        res.status(500).json({ message: error.message, error });
      });

    const hashedPassword = await axios.get(`${SERVER_URL}/encrypt-data`, {
        params: { data: password },
      })
      .then((response) => response.data.encryptedData)
      .catch((error) => {
        handleError(error, 'Error encrypting password'); // Maneja errores
        res.status(500).json({ message: error.message, error });
      });

    await axios
      .post(`${SERVER_URL}/user`, {
        // id_device: id_device, // ID del dispositivo
        username: username, // Nombre de usuario
        password: hashedPassword, // Contraseña cifrada
        id_contact: id_contact, // ID del contacto
        register_date: new Date(), // Fecha de registro
        type: 'user' // Tipo de usuario
      })
      .then(async (objuser) => {
        await axios.post(`${SERVER_URL}/create-session`, {
            id_user: objuser.data._id
          })
          .then(async (objsession) => {
            await axios.put(`${SERVER_URL}/user/${objuser.data._id}`, {
              id_session: objsession.data.id, // Actualiza el ID de sesión del usuario
            });

            const dataUser = await axios.post(`${SERVER_URL}/post-data-user`, {
              username,
              id_contact,
              type: 'user', // Tipo de usuario (admin o user)
              id_user: objuser.data._id, // ID del usuario
            })
            .then((resp) => resp.data)
            .catch((error) => {
              handleError(error, 'Error creating token'); // Maneja errores
              return res.status(500).json({ message: error.message, error });
            });

            res.json({
              ...dataUser,
              success: true,
              message: 'User registered successfully',
              userId: objuser.data._id,
              sessionId: objsession.data.id,
            });
          })
          .catch((error) => {
            handleError(error, 'Error creating sessionn'); // Maneja errores
            res.status(500).json({ message: error.message, error });
          });
      })
      .catch((error) => {
        handleError(error, 'Error posting user'); // Maneja errores
        res.status(500).json({ message: error.message, error });
      });
    });

  app.post('/logout', async (req, res) => {
    const { id_user } = req.body || req.query; // Obtiene el ID del usuario de los parámetros de la consulta

    console.log(req.body) 

    if (!id_user) {
      handleError(new Error('id_user is required'), 'Error closing session'); // Maneja errores
      return res.status(400).json({ message: 'id_user is required' });
    }

    // Con el id_user obtiene el registro de user y extrae el id_session en este registro
    await axios.get(`${SERVER_URL}/user/${id_user}`)
      .then(async (objUser) => {
        const id_session = objUser.data.id_session; // Obtiene el ID de la sesión del usuario

        if (!id_session) {
          handleError(new Error('No session found for this user'), 'Error closing session'); // Maneja errores
          return res.status(404).json({ message: 'No session found for this user' });
        }
        
        const newDate = new Date(); // Obtiene la fecha actual
        newDate.setHours(newDate.getHours() - 4); // Ajusta la hora a GMT-4

        // Con el id_session se modifica (put) el session_state a closed
        await axios.put(`${SERVER_URL}/session/${id_session}`, { 
          session_state: 'closed',
          date: newDate, // Fecha ajustada
        })
          .then(() => {
            res.json({ message: 'Session closed successfully' });
          })
          .catch((error) => {
            handleError(error, 'Error closing session'); // Maneja errores
            res.status(500).json({ message: error.message, error });
          });
      })
      .catch((error) => {
        handleError(error, 'Error getting user'); // Maneja errores
        res.status(500).json({ message: error.message, error });
      });
  });

  app.post('/login', async (req, res) => {
    const { username, password } = req.body || req.query; 

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    await axios.get(`${SERVER_URL}/get-users`)
    .then(async (response) => {

      const users = response.data;
      const user = users.find(u => u.username === username);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Si la contraseña es correcta, setea la sesión
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      const id_session = await axios.get(`${SERVER_URL}/get-id-session`, {
        params: { id_user: user._id }, // Pasa el ID del usuario como parámetro
        })
        .then((response) => response.data.id)
        .catch((error) => {
          handleError(error, 'Error getting session ID'); // Maneja errores
          return res.status(500).json({ message: error.message, error });
        });

      if (id_session === '') {
        return res.status(404).json({ message: 'Session not found' });
      }

      await axios.put(`${SERVER_URL}/put-set-session`, {
        session_state: 'open', // Estado de la sesión
        id_user: user._id, // ID del usuario
        id_session: user.id_session || id_session, // ID de la sesión
      })
      .then(async () => {

        const dataUser = await axios.post(`${SERVER_URL}/post-data-user`, {
          username: user.username,
          id_contact: user.id_contact,
          type: user.type, // Tipo de usuario (admin o user)
          id_user: user._id, // ID del usuario
        })
        .then((resp) => resp.data)
        .catch((error) => {
          handleError(error, 'Error creating token'); // Maneja errores
          return res.status(500).json({ message: error.message, error });
        });

        res.json({
          ...dataUser,
          success: true,
          message: 'Login successful',
          userId: user._id,
          sessionId: id_session,
        });
      })
      .catch((error) => {
        handleError(error, 'Error updating session'); // Maneja errores
        return res.status(500).json({ message: error.message, error });
      });
    })
    .catch((error) => {
      handleError(error, 'Error getting users'); // Maneja errores
      return res.status(500).json({ message: error.message, error });
    })
  });

  app.post('/post-data-user', async (req, res) => {
    const { username, id_contact, type, id_user } = req.body || req.query;

    if (!username || !id_contact || !type || !id_user) {
      return res.status(400).json({ message: 'Missing required data' });
    }

    const token = await axios.get(`${SERVER_URL}/create-token`, {
          params: {
            username,
            id_contact,
            type, // Tipo de usuario (admin o user)
          },
        })
        .then((tokenResponse) => tokenResponse.data.token)
        .catch((error) => {
          handleError(error, 'Error creating token'); // Maneja errores
          return res.status(500).json({ message: error.message, error });
        });

      const infoUser = await axios.post(`${SERVER_URL}/post-info-user`, {
        username,
        id_user,
        token,
        id_contact,
        type,
      })
      .then((response) => response.data)
      .catch((error) => {
        handleError(error, 'Error posting user info'); // Maneja errores
        return res.status(500).json({ message: error.message, error });
      });

      res.json({
        ...infoUser,
        success: true,
        message: 'Data user posted successfully',
      });
  });

  app.get('/create-token', async (req, res) => {

    const { username, id_contact, type } = req.query || req.body;

    if (!username || !id_contact || !type) {
      return res.status(410).json({ message: 'Username, id_contact, and type are required' });
    }
    const token = jwt.sign({ username, id_contact, type }, secretKey, { expiresIn: '1h' });
    res.json({ token });  // Devuelve el token en formato JSON
  });

  app.get('/verify-token', async (req, res) => {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    try {
      const decoded = jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          console.error('Token verification error:', err);
          handleError(err, 'Error verifying token'); // Maneja errores
          return res.status(401).json({ valid: false, message: 'Invalid token' });
        }
        return decoded;
      });
      res.json({ valid: true, decoded });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ valid: false, message: 'Invalid token' });
    }
  });

  app.get('/token-dispatcher', async (req, res) => {
    const { username } = req.body || req.query;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const userToken = tokens.find(tokenObj => tokenObj[username]);
    if (!userToken) {
      return res.status(404).json({ message: 'Token not found for this user' });
    }
    
    setTimeout(() => {
      tokens = tokens.filter(tokenObj => !tokenObj[username]);
    }, 5 * 60 * 1000); // Elimina el token después de 5 minutos

    res.json({ token: userToken[username] })
  });

  app.post('/post-info-user', async (req, res) => {
    const { username } = req.body || req.query;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    let newInfo = {[username]: { ...req.body }};

    // Si el usuario ya existe, actualiza la información
    if (info.infoUsers[username]) {
      newInfo = {[username]: { ...info.infoUsers[username], ...req.body }};
    }

    info.infoUsers = {
      ...info.infoUsers,
      ...newInfo,
    };

    res.json({ message: 'User info updated successfully', infoUsers: info.infoUsers });
  });

  app.get('/info', async (req, res) => {
    if (Object.keys(info).length === 0) {
      return res.status(404).json({ message: 'No info available' });
    }

    res.json(info);
  });

  app.post('/info', async (req, res) => {
    const thisInfo = JSON.parse(req.body.info || req.query.info || '{}');
    if (!thisInfo || typeof thisInfo !== 'object') {
      return res.status(400).json({ message: 'The data sent must be an object converted to string in a property called info' });
    }

    // Actualiza la información global
    info = { ...info, ...thisInfo };
    res.json({ message: 'Info updated successfully', info });
  });

  app.post('/get-info-user', async (req, res) => {
    const { username } = req.body || req.query;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Buscar el usuario en info.infoUsers
    const userInfo = info.infoUsers[username];
    if (!userInfo) {
      return res.status(404).json({ message: 'User info not found' });
    }

    res.json(userInfo);
  });

};

const handleError = (error, message) => {
  // console.error(error);
  console.error(
    // error, '\n',
    error.message, '\n',
    error.path,  '\n',
    error.response ? error.response.data : '', '\n',
    error.response ? error.response.status : '', '\n',
    error.request ? error.request.path : '', '\n',
    error.request ? error.request.method : '', '\n',
    message, '\n',
  );
  // throw new Error(`${message}: ${error.message}`);
};
