import { Note } from '../models/noteModels.js';

export const createNoteControllers = async (app) => {
  app.get('/notes', async (req, res) => {
    try {
      const notes = await Note.find();
      res.json(notes);
    } catch (error) {
      res.status(403).json({ message: error.message });
      console.log(JSON.stringify(error, null, 2));
    }
  });

  app.get('/note/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const note = await Note.findById(id);
      res.json(note);
    } catch (error) {
      res.status(405).json({ message: error.message });
      console.log(JSON.stringify(error, null, 2));
    }
  });

  app.post('/note', async (req, res) => {
    try {
      const note = new Note(req.body);
      await note.save();
      res.json(note);
    } catch (error) {
      res.status(402).json({ message: error.message });
      console.log(JSON.stringify(error, null, 2));
    }
  });

  app.put('/note/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const note = await Note.findByIdAndUpdate(id, req.body, { new: true });
      res.json(note);
    } catch (error) {
      res.status(400).json({ message: error.message });
      console.log(JSON.stringify(error, null, 2));
    }
  });

  app.delete('/note/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await Note.findByIdAndDelete(id);
      res.json({ message: 'Note deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(JSON.stringify(error, null, 2));
    }
  });
};
