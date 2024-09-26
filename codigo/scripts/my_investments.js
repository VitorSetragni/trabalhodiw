document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('modal');
  const newDepositButton = document.getElementById('new-deposit');
  const closeModal = document.querySelector('.close');
  const classeInput = document.getElementById('classe');
  const nameInput = document.getElementById('nomeDoAtivo');
  const valorInput = document.getElementById('valorTotal');
  const form = document.getElementById('form');

  // Função para abrir o modal
  newDepositButton.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  // Função para fechar o modal
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Enviar formulário para adicionar investimento
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const classe = classeInput.value;
    const nome = nameInput.value;
    const valor = parseFloat(valorInput.value);

    function validname(nome) {
      const classnamere = new RegExp(/^[A-Z0-9.+_-]+$/);
      return classnamere.test(nome);
    }

    function validvalor(valor) {
      const valorre = new RegExp(/^[0-9.]+$/);
      return valorre.test(valor);
    }

    if (classeInput.value === "") {
      alert("Por favor, selecione a classe do ativo");
      return;
    }

    if (nameInput.value === "" || !validname(nameInput.value)) {
      alert("Por favor, preencha o nome do ativo\n OBS: use letras maiúsculas.");
      return;
    }

    if (valorInput.value === "" || !validvalor(valorInput.value)) {
      alert("Por favor, informe o valor total adquirido do ativo\n OBS: use ponto para separar os centavos.");
      return;
    }

    var activeUser = JSON.parse(localStorage.getItem('activeUser'));
    if (!activeUser) {
      alert("Usuário não encontrado.");
      return;
    }
    if (!Array.isArray(activeUser.investments)) {
      activeUser.investments = [];
    }

    const existingInvestment = activeUser.investments.find(investment => investment.name === nome && investment.classe === classe);
    if (existingInvestment) {
      existingInvestment.amount += valor;
    } else {
      activeUser.investments.push({ classe, name: nome, amount: valor });
    }
    localStorage.setItem('activeUser', JSON.stringify(activeUser));
    recordTransaction(classe, nome, valor, "compra");
    modal.style.display = 'none';
    alert("Seu aporte foi salvo com sucesso!");
    form.reset();
    location.reload();
  });

  // Função para exibir todos os investimentos ao carregar a página
  function loadAllInvestments() {
    var activeUser = JSON.parse(localStorage.getItem('activeUser'));
    console.log(activeUser);
    if (activeUser && Array.isArray(activeUser.investments)) {
      displayProducts(activeUser.investments);
    }
  }

  // Carregar todos os investimentos por padrão
  loadAllInvestments();

  // Função de filtro
  var forma = document.getElementById("filterForm");
  forma.onsubmit = function (e) {
    e.preventDefault();

    var activeUser = JSON.parse(localStorage.getItem('activeUser'));
    if (!activeUser || !Array.isArray(activeUser.investments)) {
      alert("Nenhum investimento encontrado.");
      return;
    }

    var investments = activeUser.investments;
    var fclasse = document.getElementById("classea").value;
    var fnome = document.getElementById("nome").value;

    // Filtra por classe e nome
    var filteredProducts = investments.filter(function (product) {
      var matchesClasse = fclasse ? product.classe === fclasse : true;
      var matchesNome = fnome ? product.name.includes(fnome) : true;
      return matchesClasse && matchesNome;
    });

    if (filteredProducts.length === 0) {
      alert("Nenhum investimento encontrado com esses critérios.");
    }

    displayProducts(filteredProducts);
  };

  // Função para exibir os produtos/investimentos
  function displayProducts(products) {
    var marketPositionTbody = document.getElementById('marketPosition');
    marketPositionTbody.innerHTML = '';  // Limpar tabela

    products.forEach(function (investment) {
      var tr = document.createElement('tr');

      var tdClasse = document.createElement('td');
      tdClasse.textContent = investment.classe;
      tr.appendChild(tdClasse);

      var tdName = document.createElement('td');
      tdName.textContent = investment.name;
      tr.appendChild(tdName);

      var tdTotalValue = document.createElement('td');
      tdTotalValue.textContent = investment.amount;
      tr.appendChild(tdTotalValue);

      var tdAction = document.createElement('td');
      var sellButton = document.createElement('button');
      sellButton.textContent = 'Vender';
      sellButton.classList.add('btn', 'btn-danger');

      sellButton.addEventListener('click', function () {
        sellInvestment(investment.name);
      });

      tdAction.appendChild(sellButton);
      tr.appendChild(tdAction);

      marketPositionTbody.appendChild(tr);
    });
  }

  // Botão para limpar os filtros
  document.getElementById("clearFilters").addEventListener("click", function () {
    document.getElementById("filterForm").reset();
    loadAllInvestments();  // Recarrega todos os investimentos
  });

  // Função para vender investimento
  function sellInvestment(investmentName) {
    var activeUser = JSON.parse(localStorage.getItem('activeUser'));
    var confirmation = confirm('Você tem certeza que deseja vender 1 unidade de ' + investmentName + '?');
    if (confirmation) {
      var investmentIndex = activeUser.investments.findIndex(function (inv) {
        return inv.name === investmentName;
      });

      if (investmentIndex !== -1) {
        var investment = activeUser.investments[investmentIndex];
        activeUser.investments.splice(investmentIndex, 1);
        recordTransaction(investment.classe, investment.name, investment.amount, "venda");
        localStorage.setItem('activeUser', JSON.stringify(activeUser));
        alert('Você vendeu todas as unidades de ' + investmentName);
        location.reload();

      }
    }
  }
  function sellInvestment(investmentName) {
    var activeUser = JSON.parse(localStorage.getItem('activeUser'));
    // Inicializar o histórico de transações, caso não exista
    if (!activeUser.transactionHistory) {
      activeUser.transactionHistory = [];
    }

    var confirmation = confirm('Você tem certeza que deseja vender 1 unidade de ' + investmentName + '?');
    if (confirmation) {
      var investmentIndex = activeUser.investments.findIndex(function (inv) {
        return inv.name === investmentName;
      });

      if (investmentIndex !== -1) {
        var investment = activeUser.investments[investmentIndex];
        if (investment.amount > investment.amount) {
          investment.amount -= investment.amount;

          // Registrar a venda no histórico do usuário
          recordTransaction(investment.classe, investmentName, investment.amount, "venda");

          localStorage.setItem('activeUser', JSON.stringify(activeUser));
          alert('Você vendeu 1 unidade de ' + investmentName);
          location.reload();
        } else {
          activeUser.funds += investment.amount;
          activeUser.investments.splice(investmentIndex, 1);
          localStorage.setItem('activeUser', JSON.stringify(activeUser));
          // Registrar a venda no histórico do usuário
          console.log("foi?"); recordTransaction(investment.classe, investmentName, investment.amount, "venda");

          activeUser.investments.splice(investmentIndex, 1);



          //  localStorage.setItem('activeUser', JSON.stringify(activeUser));
          alert('Você vendeu 1 unidade de ' + investmentName);
          location.reload();
        }
      }
    }
  }

  // Função para registrar transações de venda
  function recordTransaction(classe, name, amount, type) {
    var activeUser = JSON.parse(localStorage.getItem('activeUser'));

    if (!activeUser.transactionHistory) {
      activeUser.transactionHistory = [];
    }

    var date = new Date().toLocaleString();
    var transaction = { classe, name, amount, type, date };

    activeUser.transactionHistory.push(transaction);
    console.log('Transação registrada:', transaction);
    localStorage.setItem('activeUser', JSON.stringify(activeUser));
  }
});
