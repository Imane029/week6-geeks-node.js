const postsUl = document.getElementById("posts");
const postForm = document.getElementById("postForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");

const API_URL = "/posts";


async function fetchPosts() {
  const res = await fetch(API_URL);
  const posts = await res.json();
  postsUl.innerHTML = "";

  posts.forEach(post => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <small>${new Date(post.timestamp).toLocaleString()}</small>
    `;
    postsUl.appendChild(li);
  });
}


postForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: titleInput.value,
      content: contentInput.value
    })
  });

  titleInput.value = "";
  contentInput.value = "";
  fetchPosts();
});

fetchPosts();
