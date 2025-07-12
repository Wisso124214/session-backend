import axios from 'axios';
import { SERVER_URL } from './config.js';

import app from './middleware.js';
import { dbConnection } from './db.js';
import { createUserControllers } from './controllers/userController.js';
import { createNoteControllers } from './controllers/noteController.js';
import { createUserRoutes } from './routes/userRoutes.js';
import { createNoteRoutes } from './routes/noteRoutes.js';

dbConnection(app)
  .then(async () => {
    await createUserControllers(app);
    await createUserRoutes(app);

    await createNoteControllers(app);
    await createNoteRoutes(app);

    const foundUserByUsername = async (username) => 
      await axios.get(`${SERVER_URL}/get-users`)
      .then((response) => {
        if (response.data.length === 0) {
          console.log('No users found, creating default user...');
        }

        const user = response.data.filter(user => user.username === username)[0]
        return user;
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        return null;
      });

      const getAllNotes = async () => {
        await axios.get(`${SERVER_URL}/get-notes`)
        .then((res) => res.data)
        .catch((error) => {
          console.error('Error fetching notes:', error);
          return null;
        });
      }

      const deleteAllNotes = async () => {
        await axios.get(`${SERVER_URL}/get-notes`)
        .then((res) => {
          console.log('Notes fetched successfully:', res.data);
          res.data.forEach(async (note) => {
            await axios.delete(`${SERVER_URL}/delete-note/${note._id}`)
            .then(() => {
              console.log(`Deleted note with ID: ${note._id}`);
            })
            .catch((error) => {
              console.error(`Error deleting note with ID ${note._id}:`, error);
            });
          });
        })
        .catch((error) => {
          console.error('Error fetching notes:', error);
        });
      }

    const postNotes = async (notes, username) => {
      const user = await foundUserByUsername(username);

      if (!user) {
        console.error('User not found, cannot post notes.');
        return;
      }

      for (const note of notes) {
        const noteData = {
          ...note,
          user_id: user._id,
        };

        await axios.post(`${SERVER_URL}/post-note`, noteData)
          .then((response) => {
            console.log('Note posted successfully:', response.data);
          })
          .catch((error) => {
            console.error('Error posting note:', error);
          });
      }
    }

    // postNotes([
    //   {
    //     title: 'First Note',
    //     content: 'This is the content of the first note.',
    //     tags: ['tag1', 'tag2'],
    //     created_at: new Date(),
    //     updated_at: new Date(),
    //   },
    //   {
    //     title: 'Second Note',
    //     content: 'This is the content of the second note.',
    //     tags: ['tag3', 'tag4'],
    //     created_at: new Date(),
    //     updated_at: new Date(),
    //   },
    //   {
    //     title: 'Third Note',
    //     content: 'This is the content of the third note.',
    //     tags: ['tag5', 'tag6'],
    //     created_at: new Date(),
    //     updated_at: new Date(),
    //   },
    // ], 'Wisso123')
  })
  .catch((err) => {
    console.log('Error connecting to db ', err);
  });

process.on('uncaughtException', function (err) {
  console.log(err);
});
