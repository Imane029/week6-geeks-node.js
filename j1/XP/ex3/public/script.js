const todoForm = document.getElementById("todoForm");
const titleInput = document.getElementById("title");
const todosUl = document.getElementById("todos");
const API_URL = "/api/todos";


async function fetchTodos() {
  const res = await fetch(API_URL);
  const todos = await res.json();
  todosUl.innerHTML = "";

  todos.forEach(todo => {
    const li = document.createElement("li");
    li.className = todo.completed ? "completed" : "";
    li.innerHTML = `
      <span>${todo.title}</span>
      <div>
        <button class="complete-btn" onclick="toggleComplete(${todo.id}, ${todo.completed})">✔️</button>
        <button class="delete-btn" onclick="deleteTodo(${todo.id})">🗑️</button>
      </div>
    `;
    todosUl.appendChild(li);
  });
}


todoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  if (!title) return;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, completed: false })
  });

  titleInput.value = "";
  fetchTodos();
});


async function deleteTodo(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchTodos();
}


async function toggleComplete(id, completed) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !completed })
  });
  fetchTodos();
}


fetchTodos();
