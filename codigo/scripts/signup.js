document
  .getElementById("signupForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    $("#termsModal").modal("show");
  });

document.getElementById("agreeButton").addEventListener("click", function () {
  var nome = document.getElementById("name").value;
  var surname = document.getElementById("surname").value;
  var email = document.getElementById("email").value;
  var phone = document.getElementById("phone").value;
  var cpf = document.getElementById("cpf").value;
  var login = document.getElementById("login").value;
  var password = document.getElementById("password").value;

  var users = JSON.parse(localStorage.getItem("users")) || [];

  var exists = users.some(function (user) {
    return user.login === login;
  });

  if (exists) {
    alert("Login already exists");
  } else {
    var user = {
      nome: nome,
      surname: surname,
      email: email,
      phone: phone,
      cpf: cpf,
      login: login,
      password: password,
    };

    users.push(user);

    localStorage.setItem("users", JSON.stringify(users));

    alert("User registered successfully");

    location.href = "index.html";
  }
});
