document.addEventListener('DOMContentLoaded', function () {
  // Retrieve the active user's investments from local storage
  var activeUser = JSON.parse(localStorage.getItem('activeUser'));
  var investments = activeUser ? activeUser.investments : [];
  // Group investments by name
  var groupedInvestments = investments.reduce(function (acc, investment) {
    if (!acc[investment.name]) {
      acc[investment.name] = { amount: 0, risk: investment.risk, unitPrice: investment.amount };
    }
    acc[investment.name].amount += investment.amount;
    return acc;
  }, {});

  // Get the tbody element where the market position will be inserted
  var marketPositionTbody = document.getElementById('marketPosition');

  // Populate the table with the grouped investments
  Object.keys(groupedInvestments).forEach(function (name) {
    var investment = groupedInvestments[name];
    var tr = document.createElement('tr');

    var tdName = document.createElement('td');
    tdName.textContent = name;
    tr.appendChild(tdName);

    var tdQuantity = document.createElement('td');
    tdQuantity.textContent = (investment.amount / investment.unitPrice); // a quantidade é o valor total divido pelo valor unitario
    tr.appendChild(tdQuantity);

    var tdUnitPrice = document.createElement('td');
    tdUnitPrice.textContent = investment.unitPrice; // Assuming the unit price is the same as the amount for single investment
    tr.appendChild(tdUnitPrice);

    var tdTotalValue = document.createElement('td');
    tdTotalValue.textContent = investment.amount; // Total value is the same as amount for single investment
    tr.appendChild(tdTotalValue);

    // Criar célula para o botão "Vender"
    var tdAction = document.createElement('td');
    var sellButton = document.createElement('button');
    sellButton.textContent = 'Vender';
    sellButton.classList.add('btn', 'btn-danger');

    // Função para vender o investimento
    sellButton.addEventListener('click', function () {
      sellInvestment(name);
    });

    tdAction.appendChild(sellButton);
    tr.appendChild(tdAction);

    marketPositionTbody.appendChild(tr);
  });

  function sellInvestment(investmentName) {
    var confirmation = confirm('Você tem certeza que deseja vender 1 unidade de ' + investmentName + '?');
    if (confirmation) {
      var investmentIndex = activeUser.investments.findIndex(function (inv) {
        return inv.name === investmentName;
      });

      if (investmentIndex !== -1) {
        var investment = activeUser.investments[investmentIndex];
        if (investment.amount > investment.unitPrice) {
          investment.amount -= investment.unitPrice;

          // Registrar a venda no histórico do usuário
          recordTransaction(investmentName, investment.unitPrice, "venda");

          localStorage.setItem('activeUser', JSON.stringify(activeUser));
          alert('Você vendeu 1 unidade de ' + investmentName);
          location.reload();
        } else {
          activeUser.funds += investment.amount;
          activeUser.investments.splice(investmentIndex, 1);

          // Registrar a venda no histórico do usuário
          recordTransaction(investmentName, investment.amount, "venda");

          localStorage.setItem('activeUser', JSON.stringify(activeUser));
          alert('Você vendeu 1 unidade de ' + investmentName);
          location.reload();
        }
      }
    }
  }

  // Função para registrar uma transação no histórico do usuário
  function recordTransaction(name, amount, type) {
    // Verificar se o usuário ativo tem um histórico de transações
    if (!activeUser.transactionHistory) {
      activeUser.transactionHistory = [];
    }

    var date = new Date().toLocaleString();
    var transaction = {
      name: name,
      amount: amount,
      type: type,
      date: date
    };

    // Adicionar a transação ao histórico do usuário
    activeUser.transactionHistory.push(transaction);

    // Atualizar o localStorage com o activeUser
    localStorage.setItem('activeUser', JSON.stringify(activeUser));
  }

});
