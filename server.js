const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;


app.use(express.json());
app.use(cors());  // Permitir todas las solicitudes desde cualquier origen

// Configurar la base de datos SQLite
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err.message);
  } else if (process.env.NODE_ENV !== 'test') {
    console.log("Conectado a la base de datos SQLite.");
  }
});

// Crear la tabla de usuarios si no existe
db.run(`
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
  db.run(sql, [name, email, hashedPassword], function (err) {
    if (err) {
      return res.status(500).json({ message: "Error al registrar el usuario", error: err.message });
    }
    res.status(201).json({ message: "Usuario registrado con éxito", userId: this.lastID });
  });
});

// Ruta para obtener la lista de usuarios
app.get('/api/users', (req, res) => {
  db.all("SELECT id, name, email FROM users", (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Error al obtener los usuarios", error: err.message });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

function validatePassword(password) {
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/.test(password);
}

module.exports = {validatePassword };  // Exportar la función