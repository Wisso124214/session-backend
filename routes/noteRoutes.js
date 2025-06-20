import axios from 'axios';
import { SERVER_URL } from '../config.js';

export const createNoteRoutes = async (app) => {

  app.get('/get-notes', async (req, res) => {
    axios
      .get(`${SERVER_URL}/notes`)
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        res.status(405).json(error);
        console.log(JSON.stringify(error, null, 2));
      });
  });

  app.get('/get-note/:id', async (req, res) => {
    axios
      .get(`${SERVER_URL}/note/${req.params.id}`)
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        res.status(405).json(error);
        console.log(JSON.stringify(error, null, 2));
      });
  });

  app.post('/post-note', async (req, res) => {
    axios
      .post(`${SERVER_URL}/note`, req.body)
      .then(async (response) => {
        res.json(response.data);
      })
      .catch((error) => {
        res.status(402).json(error);
        console.log(JSON.stringify(error, null, 2));
      });
  });

  app.put('/update-note/:id', async (req, res) => {
    await axios
      .put(`${SERVER_URL}/note/${req.params.id}`, req.body)
      .then(async (response) => {
        res.json(response.data);
      })
      .catch((error) => {
        res.status(405).json(error);
        console.log(JSON.stringify(error, null, 2));
      });
  });

  app.delete('/delete-note/:id', async (req, res) => {
    axios
      .delete(`${SERVER_URL}/note/${req.params.id}`)
      .then(async (response) => {
        res.json(response.data);
      })
      .catch((error) => {
        res.status(406).json(error);
        console.log(JSON.stringify(error, null, 2));
      });
  });
};
