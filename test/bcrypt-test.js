import bcrypt from 'bcrypt';

const encryptData = (data) => {
  const saltRounds = 10; 
  const salt = bcrypt.genSaltSync(saltRounds); // Genera un salt
  const hash = bcrypt.hashSync(data, salt); // Cifra los datos con el salt
  return hash; // Devuelve el hash cifrado
}

const compareData = (data, hash) => {
  return bcrypt.compareSync(data, hash); // Compara los datos con el hash
}

const password = 'encryptMe123';
const hashedPassword = encryptData(password); // Cifra la contraseña
console.log('Hashed Password:', hashedPassword); // Muestra el hash cifrado
console.log('Password Match:', compareData(password, '$2b$10$gur8US1HGC.ilorxqCSLsOgps8UjUyf3nA0SMqOW9O5GZaZz0QIe6')); // Verifica si la contraseña coincide con el hash