document.addEventListener('DOMContentLoaded', function () {
    // Recuperar o usuário ativo do localStorage
    var activeUser = JSON.parse(localStorage.getItem('activeUser'));
    var transactionHistory = activeUser ? activeUser.transactionHistory : [];

    var marketPositionTbody = document.getElementById('marketPosition');

    // Se o usuário tiver um histórico de transações, exibi-las
    if (transactionHistory && transactionHistory.length > 0) {
        transactionHistory.forEach(function (transaction) {
            var tr = document.createElement('tr');

            var tdClasse = document.createElement('td');
            tdClasse.textContent = transaction.classe;
            tr.appendChild(tdClasse);

            var tdName = document.createElement('td');
            tdName.textContent = transaction.name;
            tr.appendChild(tdName);

            var tdAmount = document.createElement('td');
            tdAmount.textContent = (transaction.type === "compra" ? "-" : "+") + transaction.amount;
            tr.appendChild(tdAmount);

            var tdDate = document.createElement('td');
            tdDate.textContent = transaction.date;
            tr.appendChild(tdDate);
            // Criar a célula de ação para o botão de apagar
            var tdAction = document.createElement('td');

            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Apagar';
            deleteButton.classList.add('btn', 'btn-danger');

            // Adicionar funcionalidade de apagar
            deleteButton.addEventListener('click', function () {
                deletetransaction(transaction.name);
            });

            tdAction.appendChild(deleteButton);
            tr.appendChild(tdAction);

            marketPositionTbody.appendChild(tr);
        });
    } else {
        // Se não houver transações, exibir uma mensagem informativa
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.textContent = 'Nenhuma transação registrada';
        td.setAttribute('colspan', 3);
        tr.appendChild(td);
        marketPositionTbody.appendChild(tr);
    }
});
function deletetransaction(transactionName) {
    var activeUser = JSON.parse(localStorage.getItem('activeUser'));
    var confirmation = confirm('Você tem certeza que deseja apagar o historico de ' + transactionName + '?');
    if (confirmation) {
        var transactionIndex = activeUser.transactionHistory.findIndex(function (inv) {
            return inv.name === transactionName;
        });
    }
    if (transactionIndex !== -1) {
        var transaction = activeUser.transactionHistory[transactionIndex];
        activeUser.transactionHistory.splice(transactionIndex, 1);
        localStorage.setItem('activeUser', JSON.stringify(activeUser));
        alert('Você apagou 1 transação de ' + transactionName);
        location.reload();

    }
}
