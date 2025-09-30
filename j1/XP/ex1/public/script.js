const postsDiv = document.getElementById("posts");
const postForm = document.getElementById("postForm");
const titleInput = document.getElementById("title");
const bodyInput = document.getElementById("body");

const API_URL = "/api/posts";


async function fetchPosts() {
  try {
    const res = await fetch(API_URL);
    const posts = await res.json();

    postsDiv.innerHTML = "";
    posts.slice(0, 10).forEach(post => {
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.body}</p>
      `;
      postsDiv.appendChild(div);
    });
  } catch (err) {
    console.error("Erreur lors du chargement des posts:", err);
  }
}


postForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPost = {
    title: titleInput.value,
    body: bodyInput.value
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    });

    if (res.ok) {
      const post = await res.json();
    
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `<h3>${post.title}</h3><p>${post.body}</p>`;
      postsDiv.prepend(div); 
      titleInput.value = "";
      bodyInput.value = "";
    }
  } catch (err) {
    console.error("Erreur lors de l'ajout du post:", err);
  }
});

fetchPosts();
