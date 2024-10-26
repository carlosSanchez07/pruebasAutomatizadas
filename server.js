const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());  // Permitir todas las solicitudes desde cualquier origen

// Configurar la base de datos SQLite
const db = new Database('./users.db', { verbose: console.log }); // Se puede omitir verbose si no es necesario

// Crear la tabla de usuarios si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

// Ruta de registro de usuario
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!validatePassword(password)) {
    return res.status(400).json({ message: "La contraseña no cumple con los requisitos" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  const stmt = db.prepare(sql);
  const result = stmt.run(name, email, hashedPassword);
  
  if (result.changes === 0) {
    return res.status(500).json({ message: "Error al registrar el usuario" });
  }
  res.status(201).json({ message: "Usuario registrado con éxito", userId: result.lastInsertRowid });
});

// Ruta para obtener la lista de usuarios
app.get('/api/users', (req, res) => {
  const rows = db.prepare("SELECT id, name, email FROM users").all();
  res.json(rows);
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

function validatePassword(password) {
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/.test(password);
}

module.exports = { validatePassword };  // Exportar la función
