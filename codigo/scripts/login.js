document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var login = document.getElementById("login").value;
    var password = document.getElementById("password").value;

    var users = JSON.parse(localStorage.getItem("users")) || [];

    var user = users.find(function (user) {
      return user.login === login;
    });

    if (user && password === user.password) {
      localStorage.setItem("activeUser", JSON.stringify(user));

      // display successful login message modal
      $("#success").modal("show");
    } else {
      location.href = "login.html";
    }
  });
