// Sample data structure for posts
let posts = [];

// Check if there are posts in local storage
if (localStorage.getItem("posts")) {
  posts = JSON.parse(localStorage.getItem("posts"));
} else {
  // If not, use the sample data and save it to local storage
  localStorage.setItem("posts", JSON.stringify(posts));
}

// Function to create a post element
function createPostElement(post) {
  const postElement = document.createElement("div");
  postElement.classList.add("card", "my-4");

  postElement.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${post.author} ${post.date}</h6>
                    <p class="card-text">${post.content}</p>
                    <button class="btn btn-primary darker-gray" onclick="viewComments('${post.title}')">Ver comentários</button>
                </div>
            `;

  return postElement;
}

function viewComments(postTitle) {
  // Find the post by title
  const post = posts.find((p) => p.title === postTitle);

  // If the post exists, display its comments
  if (post) {
    const commentsBody = document.getElementById("commentsBody");
    commentsBody.innerHTML = ""; // Clear any existing comments

    post.comments.forEach((comment) => {
      const h = document.createElement("h6");
      h.innerText = comment.author + " - " + comment.date + ":";
      commentsBody.appendChild(h);
      const p = document.createElement("p");
      p.innerText = comment.content;
      commentsBody.appendChild(p);
    });

    // Show the modal
    var myModal = new bootstrap.Modal(
      document.getElementById("commentsModal"),
      {}
    );

    currentPostTitle = postTitle;

    myModal.show();
  }
}

function addComment() {
  // Get the new comment from the text area
  const newComment = document.getElementById("newComment").value;

  // Find the post by title
  const post = posts.find((p) => p.title === currentPostTitle);

  // Get the active user from local storage
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));

  // Set the activeUser user field as the author of the comment
  const author = activeUser.nome;

  // If the post exists, add the new comment
  if (post) {
    post.comments.push({
      author: author,
      date: new Date().toLocaleString(),
      content: newComment,
    });

    // Clear the text area
    document.getElementById("newComment").value = "";

    // Save the updated posts to local storage
    localStorage.setItem("posts", JSON.stringify(posts));
  }

  // Close the modal
  var myModal = bootstrap.Modal.getInstance(
    document.getElementById("commentsModal")
  );
  myModal.hide();
}

function addPost() {
  // Get the new post title from the text area
  const newPostTitle = document.getElementById("newPostTitle").value;

  // Get the new post content from the text area
  const newPostContent = document.getElementById("newPost").value;

  // Get the active user from local storage
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));

  // Set the activeUser user field as the author of the comment
  const author = activeUser.nome;

  // Add the new post to the posts array
  posts.push({
    title: newPostTitle,
    author: author,
    date: new Date().toLocaleString(),
    content: newPostContent,
    comments: [],
  });

  // Save the updated posts to local storage
  localStorage.setItem("posts", JSON.stringify(posts));

  // Close the modal
  var myModal = bootstrap.Modal.getInstance(
    document.getElementById("newPostModal")
  );
  myModal.hide();

  // Redirect to the forum page
  window.location.href = "forum.html";
}

const postList = document.getElementById("postList");

// Create and append post elements
for (const post of posts) {
  postList.appendChild(createPostElement(post));
}
