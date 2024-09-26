window.onload = function () {
  // Display all products when the page loads
  displayProducts(products);

  // Filter products when the form is submitted
  var form = document.getElementById("filterForm");
  form.onsubmit = function (e) {
    e.preventDefault();

    // Get the values from the form
    var risk = document.getElementById("risk").value;
    var minimumInvestment = document.getElementById("minimumInvestment").value;
    var maturity = document.getElementById("maturity").value;
    var returnRate = document.getElementById("returnRate").value;

    // Filter the products
    var filteredProducts = products.filter(function (product) {
      return (
        product.risk == risk &&
        product.minimumInvestment <= minimumInvestment &&
        product.return >= returnRate &&
        product.maturity <= maturity
      );
    });
    displayProducts(filteredProducts);
  };
};

document.getElementById("clearFilters").addEventListener("click", function () {
  // Clear the form
  document.getElementById("filterForm").reset();
  displayProducts(products);
});
function recordTransaction(name, amount, type) {
  // Recuperar o usuário ativo do localStorage
  var activeUser = JSON.parse(localStorage.getItem('activeUser'));
  console.log('Usuário ativo antes da transação:', activeUser);

  // Verificar se o usuário ativo tem um histórico de transações
  if (!activeUser.transactionHistory) {
    console.log('Histórico de transações não encontrado, inicializando...');
    activeUser.transactionHistory = [];
  }

  // Registrar a data atual
  var date = new Date().toLocaleString();

  // Criar o objeto de transação
  var transaction = {
    name: name,
    amount: amount,
    type: type,
    date: date
  };

  // Adicionar a transação ao histórico de transações do usuário
  activeUser.transactionHistory.push(transaction);
  console.log('Transação registrada:', transaction);

  // Atualizar o localStorage com o activeUser atualizado
  localStorage.setItem('activeUser', JSON.stringify(activeUser));
  console.log('Usuário ativo após a transação:', activeUser);
}

/**
 * Displays the list of products in a table format.
 * @param {Array} products - The array of products to be displayed.
 */
function displayProducts(products) {
  // get active user object from local storage
  var activeUser = localStorage.getItem("activeUser");

  // get user's investor risk profile from object
  var userRiskProfile = JSON.parse(activeUser).investorProfile;

  // map user's risk profile to numerical value
  var userRiskProfileMap = {
    defensive: 1,
    moderate: 2,
    aggressive: 3,
  };

  // map product risk profile to numerical value
  var productRiskProfileMap = {
    Baixo: 1,
    Moderado: 2,
    Alto: 3,
  };

  var productList = document.getElementById("productList");
  productList.innerHTML = "";

  var table = document.createElement("table");
  table.className = "table";

  var thead = document.createElement("thead");
  var tr = document.createElement("tr");

  [
    "Nome",
    "Risco",
    "Aplicação Mínima",
    "Rentabilidade (a.a.)",
    "Vencimento",
    "Action",
  ].forEach(function (header) {
    var th = document.createElement("th");
    th.textContent = header;
    tr.appendChild(th);
  });

  thead.appendChild(tr);
  table.appendChild(thead);

  var tbody = document.createElement("tbody");

  products.forEach(function (product) {
    var tr = document.createElement("tr");

    [
      product.name,
      product.risk,
      product.minimumInvestment,
      product.return,
      product.maturity,
    ].forEach(function (field) {
      var td = document.createElement("td");
      if (field === product.maturity) {
        // Assuming the date is in the format 'yyyy-mm-dd'
        var dateParts = field.split("-");
        var dateObject = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

        // Format the date as 'mm/dd/yyyy'
        td.textContent =
          dateObject.getDate() +
          "/" +
          (dateObject.getMonth() + 1) +
          "/" +
          dateObject.getFullYear();
      } else {
        td.textContent = field;
      }
      tr.appendChild(td);
    });

    var td = document.createElement("td");

    var button = document.createElement("button");
    button.className = "btn btn-success";
    button.textContent = "Investir";

    // Disable the 'Investir' button if the product's risk does not match the investor's risk profile
    if (productRiskProfileMap[product.risk] > userRiskProfileMap[userRiskProfile]) {
      button.disabled = true;
      button.className = "btn btn-secondary"; // Change button class to indicate it's disabled (optional)
    }

    button.addEventListener('click', function () {
      // Retrieve the active user from local storage
      var activeUser = JSON.parse(localStorage.getItem('activeUser'));

      // Check if the user has sufficient funds to acquire the investment
      if (activeUser.funds >= product.minimumInvestment) {
        // Check if the 'investments' field exists, if not, initialize it
        if (!activeUser.investments) {
          activeUser.investments = [];
        }

        // Add the investment to the 'investments' array
        activeUser.investments.push({
          id: product.id,
          name: product.name,
          risk: product.risk,
          amount: product.minimumInvestment // Assuming you want to track the investment amount
        });

        // alert the user that the investment was successful with the product name, the remaining funds and the investment amount
        alert(`Investimento em ${product.name} realizado com sucesso.\n Fundos restantes: ${activeUser.funds - product.minimumInvestment}. Valor do investimento: ${product.minimumInvestment}`);

        // Deduct the investment amount from the user's funds
        activeUser.funds -= product.minimumInvestment;

        // Save the updated active user back to local storage
        localStorage.setItem('activeUser', JSON.stringify(activeUser));
        recordTransaction(product.name, product.minimumInvestment, "compra");
      } else {
        // Notify the user they do not have sufficient funds
        alert('You do not have sufficient funds to make this investment.');
      }
      console.log('Usuário após a transação salva no localStorage:', JSON.parse(localStorage.getItem('activeUser')));
    });

    td.appendChild(button);
    tr.appendChild(td);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  productList.appendChild(table);
}

// Produtos disponíveis
var products = [
  {
    name: "CDB Banco Figma",
    risk: "Alto",
    minimumInvestment: 1000,
    return: 10,
    maturity: "2023-12-31",
  },
  {
    name: "LCI Banco Delta",
    risk: "Moderado",
    minimumInvestment: 500,
    return: 5,
    maturity: "2022-12-31",
  },
  {
    name: "Tesouro Selic",
    risk: "Baixo",
    minimumInvestment: 100,
    return: 2,
    maturity: "2024-12-31",
  },
  {
    name: "LCI Banco Gama",
    risk: "Moderado",
    minimumInvestment: 800,
    return: 6,
    maturity: "2023-06-30",
  },
  {
    name: "Debêntures Corporativas",
    risk: "Alto",
    minimumInvestment: 2000,
    return: 12,
    maturity: "2025-03-15",
  },
  {
    name: "Fundo de Ações TecnoInvest",
    risk: "Alto",
    minimumInvestment: 500,
    return: 15,
    maturity: "2026-01-01",
  },
  {
    name: "CRI Construção Sustentável",
    risk: "Moderado",
    minimumInvestment: 1000,
    return: 7,
    maturity: "2024-08-15",
  },
  {
    name: "LCI Banco Ômega",
    risk: "Baixo",
    minimumInvestment: 300,
    return: 3,
    maturity: "2023-11-30",
  },
  {
    name: "FII Imóveis Urbanos",
    risk: "Moderado",
    minimumInvestment: 1000,
    return: 8,
    maturity: "2025-02-28",
  },
  {
    name: "CDB Banco Vênus",
    risk: "Alto",
    minimumInvestment: 1500,
    return: 9,
    maturity: "2024-10-31",
  },
  {
    name: "Tesouro IPCA+",
    risk: "Baixo",
    minimumInvestment: 200,
    return: 4,
    maturity: "2025-07-31",
  },
  {
    name: "Ações Energéticas",
    risk: "Alto",
    minimumInvestment: 1000,
    return: 18,
    maturity: "2027-04-15",
  },
  {
    name: "CRI Agronegócio Brasil",
    risk: "Moderado",
    minimumInvestment: 1500,
    return: 6,
    maturity: "2023-09-30",
  },
  {
    name: "Fundo Multimercado Global",
    risk: "Alto",
    minimumInvestment: 2000,
    return: 12,
    maturity: "2025-12-31",
  },
  {
    name: "LCI Banco Zeta",
    risk: "Baixo",
    minimumInvestment: 500,
    return: 3,
    maturity: "2024-04-30",
  },
  {
    name: "Debêntures Infraestrutura",
    risk: "Moderado",
    minimumInvestment: 1200,
    return: 7,
    maturity: "2024-11-15",
  },
  {
    name: "FII Logística Brasil",
    risk: "Moderado",
    minimumInvestment: 800,
    return: 6,
    maturity: "2023-10-31",
  },
  {
    name: "Tesouro Prefixado",
    risk: "Baixo",
    minimumInvestment: 300,
    return: 4,
    maturity: "2025-06-30",
  },
  {
    name: "CDB Banco Ônix",
    risk: "Alto",
    minimumInvestment: 1800,
    return: 9,
    maturity: "2023-08-31",
  },
  {
    name: "Ações Sustentáveis",
    risk: "Alto",
    minimumInvestment: 1500,
    return: 20,
    maturity: "2026-03-15",
  },
];
