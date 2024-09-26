document
  .getElementById("questionario")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // prevent form submission

    var formElements = this.elements;
    var formData = {};
    var totalScore = 0;

    for (var i = 0; i < formElements.length; i++) {
      if (formElements[i].type === "radio" && formElements[i].checked) {
        formData[formElements[i].name] = formElements[i].value;

        // Add the score for each answer to the total score
        switch (formElements[i].value) {
          case "Concordo totalmente":
            totalScore += 5;
            break;
          case "Concordo":
            totalScore += 4;
            break;
          case "Neutro":
            totalScore += 3;
            break;
          case "Discordo":
            totalScore += 2;
            break;
          case "Discordo totalmente":
            totalScore += 1;
            break;
        }
      }
    }

    // Determine the investor profile based on the total score
    var investorProfile;
    if (totalScore <= 10) {
      investorProfile = "defensive";
    } else if (totalScore <= 20) {
      investorProfile = "moderate";
    } else {
      investorProfile = "aggressive";
    }

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

    // Update the current user's investor profile
    activeUser.investorProfile = investorProfile;

    // Save the updated users array back to local storage
    localStorage.setItem("users", JSON.stringify(users));

    // Update activeUser in local storage
    localStorage.setItem("activeUser", JSON.stringify(activeUser));

    // Display the modal according to the investor profile
    if (investorProfile === "defensive") {
      $("#defensiveModal").modal("show");
    } else if (investorProfile === "moderate") {
      $("#moderateModal").modal("show");
    } else {
      $("#aggressiveModal").modal("show");
    }
  });
