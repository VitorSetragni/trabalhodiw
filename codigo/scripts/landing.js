window.onload = function () {
  // Fetch the activeUser object from local storage
  var activeUser = JSON.parse(localStorage.getItem("activeUser"));

  if (activeUser && activeUser.nome) {
    document.getElementById("welcomeMessage").textContent =
      "Bem-vindo, " + activeUser.nome + ".";
  }

  // Check if the activeUser object exists and has a funds property
  if (activeUser && activeUser.funds) {
    // Get a reference to the balance element
    let balanceElement = document.getElementById("balance");

    // Assuming activeUser.funds is a number
    const formattedTotal = `R$ ${activeUser.funds.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).slice(3)}`;
    balanceElement.textContent = formattedTotal;
  }

  // Get the activeUser's investments from local storage
  let totalAmount = 0;
  activeUser.investments.forEach(investment => {
    totalAmount += investment.amount;
  });

  // Format totalAmount as currency (e.g., R$ 1.500,00)
  const formattedTotal = `R$ ${totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).slice(3)}`;

  // Update the totalInvested element with the formatted total amount
  document.getElementById('totalInvested').innerHTML = formattedTotal;

  // Fill in investor profile
  if (activeUser && activeUser.investorProfile) {
    var investorProfile = activeUser.investorProfile;

    // Get a reference to the investorProfile element
    let investorProfileElement = document.getElementById("investorProfile");

    switch (investorProfile) {
      case "aggressive":
        investorProfile = "Seu perfil atual é Agressivo.";
        break;
      case "moderate":
        investorProfile = "Seu perfil atual é Moderado.";
        break;
      case "defensive":
        investorProfile = "Seu perfil atual é Conservador.";
        break;
      default:
        investorProfile = "Seu perfil ainda não foi definido.";
    }

    // Update the investorProfile element with the activeUser's investor profile
    investorProfileElement.textContent = investorProfile;
  }
};

document
  .getElementById("addFundsForm")
  .addEventListener("submit", function (event) {
    // Prevent the form from submitting normally
    event.preventDefault();

    // Get the activeUser object from local storage
    var activeUser = JSON.parse(localStorage.getItem("activeUser"));

    // Get the login field from the activeUser object
    var login = activeUser.login;

    // Get the users array from local storage
    var users = JSON.parse(localStorage.getItem("users"));

    // Find the current user in the users array
    var currentUser = users.find(function (user) {
      return user.login === login;
    });

    // If the current user was found, add the inputted amount to their funds
    if (currentUser) {
      var amount = parseFloat(document.getElementById("amount").value);

      // Check if the "funds" field exists and if not, initialize it to 0
      if (!currentUser.hasOwnProperty("funds")) {
        currentUser.funds = 0;
      }

      activeUser.funds += amount;

      // Save the updated users array back to local storage
      localStorage.setItem("users", JSON.stringify(users));

      // Update the activeUser object in local storage
      localStorage.setItem("activeUser", JSON.stringify(activeUser));
    }

    // Clear the form
    document.getElementById("addFundsForm").reset();

    // Show the modal
    $("#successModal").modal("show");
  });

document.getElementById("okButton").addEventListener("click", function () {
  // hide the modal
  $("#successModal").modal("hide");
});
