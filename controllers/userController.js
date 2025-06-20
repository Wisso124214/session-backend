import { Contact, Session, User } from '../models/userModels.js';


/********/
//Contact
/********/
export const createUserControllers = async (app) => {  
  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await Contact.find();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(JSON.stringify(error, null, 2));
    }
  });

  app.post('/contact', async (req, res) => {
    try {
      const contact = new Contact(req.body);
      await contact.save();
      res.json(contact);
    } catch (error) {
      res.status(402).json({ message: error.message });
      console.log(JSON.stringify(error, null, 2));
    }
  });

  app.put('/contact/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const contact = await Contact.findByIdAndUpdate(id, req.body, { new: true });
      res.json(contact);
    } catch (error) {
      res.status(400).json({ message: error.message });
      console.log(JSON.stringify(error, null, 2));
    }
  });

  app.delete('/contact/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await Contact.findByIdAndDelete(id);
      res.json({ message: 'Contact deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(JSON.stringify(error, null, 2));
    }
  });


  /********/
  //Session
  /********/

  app.get('/sessions', async (req, res) => {
    try {
      const sessions = await Session.find();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(JSON.stringify(error, null, 2));
    }
  });

  app.post('/session', async (req, res) => {
    try {
      const session = new Session(req.body);
      await session.save();
      res.json(session);
    } catch (error) {
      res.status(403).json({ message: error.message });
      console.log(JSON.stringify(error, null, 2));
    }
  });

  app.put('/session/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const session = await Session.findByIdAndUpdate(id, req.body, { new: true });
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: error.message });
      console.log(JSON.stringify(error, null, 2));
    }
  });

  app.delete('/session/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await Session.findByIdAndDelete(id);
      res.json({ message: 'Session deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(JSON.stringify(error, null, 2));
    }
  });


  /*****/
  //User
  /*****/

  app.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(JSON.stringify(error, null, 2));
    }
  });

  app.get('/user/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(405).json({ message: error.message });
      console.log(JSON.stringify(error, null, 2));
    }
  });

  app.post('/user', async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.json(user);
    } catch (error) {
      res.status(403).json({ message: error.message });
      console.log(JSON.stringify(error, null, 2));
    }
  });

  app.put('/user/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndUpdate(id, req.body, { new: true });
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
      console.log(JSON.stringify(error, null, 2));
    }
  });

  app.delete('/user/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await User.findByIdAndDelete(id);
      res.json({ message: 'User deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(JSON.stringify(error, null, 2));
    }
  });

  
}