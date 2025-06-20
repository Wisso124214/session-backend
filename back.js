import axios from 'axios';
import { SERVER_URL } from './config.js';

import app from './middleware.js';
import { dbConnection } from './db.js';
import { createUserControllers } from './controllers/userController.js';
import { createNoteControllers } from './controllers/noteController.js';
import { createUserRoutes } from './routes/userRoutes.js';
import { createNoteRoutes } from './routes/noteRoutes.js';

import { encryptData } from './logicFuntions/main.js';

const notes = [
{
    title: 'Note 1. This is a long title to test wrapping',
    content: 'This is the content of note 1. It can be quite long, so it should wrap properly within the note component. This is just a test to see how the content looks when it is long enough to require wrapping.',
    color: 'transparent',

  },
  {
    title: 'Note 2',
    content: 'This is the content of note 2.',
    color: 'transparent',

  },
  {
    title: 'Note 3',
    content: 'This is the content of note 3.',
    color: 'transparent',

  },
  {
    title: 'Note 4',
    content: 'This is the content of note 4.',
    color: 'transparent',

  },
  {
    title: 'Note 5',
    content: 'This is the content of note 5.',
    color: 'transparent',

  },
  {
    title: 'Note 6',
    content: 'This is the content of note 6.',
    color: 'transparent',

  },
  {
    title: 'Note 7',
    content: 'This is the content of note 7.',
    color: 'transparent',

  },
  {
    title: 'Note 8',
    content: 'This is the content of note 8.',
    color: 'transparent',

  },
  {
    title: 'Note 9',
    content: 'This is the content of note 9.',
    color: 'transparent',

  },
  {
    title: 'Note 10',
    content: 'This is the content of note 10.',
    color: 'transparent',

  },
  {
    title: 'Note 11',
    content: 'This is the content of note 11.',
    color: 'transparent',

  },
  {
    title: 'Note 12',
    content: 'This is the content of note 12.',
    color: 'transparent',

  },
  {
    title: 'Note 13',
    content: 'This is the content of note 13.',
    color: 'transparent',

  },
  {
    title: 'Note 14',
    content: 'This is the content of note 14.',
    color: 'transparent',

  },
  {
    title: 'Note 15',
    content: 'This is the content of note 15.',
    color: 'transparent',

  },
  {
    title: 'Note 16',
    content: 'This is the content of note 16.',
    color: 'transparent',

  },
  {
    title: 'Note 17',
    content: 'This is the content of note 17.',
    color: 'transparent',

  },
  {
    title: 'Note 18',
    content: 'This is the content of note 18.',
    color: 'transparent',

  },
  {
    title: 'Note 19',
    content: 'This is the content of note 19.',
    color: 'transparent',

  },
  {
    title: 'Note 20',
    content: 'This is the content of note 20.',
    color: 'transparent',

  },
]

// getIdDevice().then((id) => {
//   console.log(id);
// });

// console.log(encryptData("data"))

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
        console.log('User found:', user);
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

    // postNotes(notes, 'Wisso123')
  })
  .catch((err) => {
    console.log('Error connecting to db ', err);
  });

process.on('uncaughtException', function (err) {
  console.log(err);
});
