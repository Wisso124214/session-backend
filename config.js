export const config = {
  DB_URL: 'mongodb+srv://backend:skeZ9tEqdLJ09Op3@cluster0.o7x9c.mongodb.net/db-bustos-lab?retryWrites=true&w=majority&appName=Cluster0',
  PORT: process.env.PORT || 3030,
  SERVER_IP: '192.168.0.177',
  PROTOCOL: 'http',
}

export const SERVER_URL = `${config.PROTOCOL}://${config.SERVER_IP}:${config.PORT}`;