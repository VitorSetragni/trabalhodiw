window.onload = function () {
  // Fetch the activeUser object from local storage
  var activeUser = JSON.parse(localStorage.getItem("activeUser"));

  // Fill in investor profile
  if (activeUser && activeUser.investorProfile) {
    var investorProfile = activeUser.investorProfile;

    // Get a reference to the investorProfile element
    let investorProfileElement = document.getElementById("investorProfile");

    switch (investorProfile) {
      case "aggressive":
        perfil = "Seu perfil atual é Agressivo.";
        break;
      case "moderate":
        perfil = "Seu perfil atual é Moderado.";
        break;
      case "defensive":
        perfil = "Seu perfil atual é Conservador.";
        break;
      default:
        perfil = "Seu perfil ainda não foi definido.";
    }

    // Update the investorProfile element with the activeUser's investor profile
    investorProfileElement.textContent = perfil;

    // Find the matching recommendation
    var recommendation = investmentRecommendations.find(function (rec) {
      return rec.profile === investorProfile;
    });

    console.log(investorProfile);
    console.log(recommendation);

    // Get a reference to the table body
    var tableBody = document.getElementById("allocationBody");

    // Clear the table body
    tableBody.innerHTML = "";

    // Fill in the table with the recommended allocations
    for (var investmentType in recommendation.allocations) {
      var row = document.createElement("tr");

      var typeCell = document.createElement("td");
      typeCell.textContent = investmentType;
      row.appendChild(typeCell);

      var allocationCell = document.createElement("td");
      allocationCell.textContent =
        recommendation.allocations[investmentType] + "%";
      row.appendChild(allocationCell);

      tableBody.appendChild(row);
    }
  }
};

// Investment recommendations based on investor profiles
const investmentRecommendations = [
  {
    profile: "aggressive",
    allocations: {
      Ações: 50,
      Debêntures: 20,
      "Fundos De Investimento": 20,
      "Tesouro Direto": 5,
      CDB: 5,
    },
  },
  {
    profile: "moderate",
    allocations: {
      Ações: 30,
      Debêntures: 20,
      "Fundos De Investimento": 20,
      "Tesouro Direto": 15,
      CDB: 15,
    },
  },
  {
    profile: "defensive",
    allocations: {
      Ações: 10,
      Debêntures: 10,
      "Fundos De Investimento": 20,
      "Tesouro Direto": 30,
      CDB: 30,
    },
  },
];
