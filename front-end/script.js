const registerForm = document.getElementById("registerForm");
const showFormBtn = document.getElementById("showFormBtn");
const userListTitle = document.getElementById("userListTitle");
const userList = document.getElementById("userList");
const userTableBody = document.getElementById("userTableBody");

// Escuchar el evento de envío del formulario
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      alert("Usuario registrado con éxito");
      registerForm.reset();
      fetchUsers();
      toggleVisibility(false);  // Ocultar formulario y mostrar la lista
    } else {
      const error = await response.json();
      alert(error.message);
    }
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
  }
});

// Función para obtener y mostrar la lista de usuarios
async function fetchUsers() {
  try {
    const response = await fetch("http://localhost:3000/api/users");
    const users = await response.json();
    
    userTableBody.innerHTML = ""; // Limpiar la tabla

    users.forEach(user => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${user.id}</td><td>${user.name}</td><td>${user.email}</td>`;
      userTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
  }
}

// Escuchar el evento de clic en el botón "Registrar otro usuario"
showFormBtn.addEventListener("click", () => {
  toggleVisibility(true);  // Mostrar formulario y ocultar la lista
  registerForm.reset();    // Limpiar formulario
});

// Función para alternar la visibilidad del formulario y la lista
function toggleVisibility(showForm) {
  registerForm.style.display = showForm ? "block" : "none";
  showFormBtn.style.display = showForm ? "none" : "inline-block";
  userListTitle.style.display = showForm ? "none" : "block";
  userList.style.display = showForm ? "none" : "table";
}
