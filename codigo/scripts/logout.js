function logout() {
  // save the activeUser to local storage in the "users" array
  var users = JSON.parse(localStorage.getItem("users"));

  // get the active user from local storage
  var activeUser = JSON.parse(localStorage.getItem("activeUser"));

  // find the active user in the users array
  var userIndex = users.findIndex(function (user) {
    return user.login === activeUser.login;
  });

  // update the active user in the users array
  users[userIndex] = activeUser;

  // save the updated users array back to local storage
  localStorage.setItem("users", JSON.stringify(users));

  // clear the active user from local storage
  localStorage.setItem("activeUser", null);

  // redirect the user to the login page
  window.location.href = "index.html";
}
