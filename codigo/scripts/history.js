document.addEventListener('DOMContentLoaded', function () {
    // Recuperar o usuário ativo do localStorage
    var activeUser = JSON.parse(localStorage.getItem('activeUser'));
    var transactionHistory = activeUser ? activeUser.transactionHistory : [];

    var marketPositionTbody = document.getElementById('marketPosition');

    // Se o usuário tiver um histórico de transações, exibi-las
    if (transactionHistory && transactionHistory.length > 0) {
        transactionHistory.forEach(function (transaction) {
            var tr = document.createElement('tr');

            var tdName = document.createElement('td');
            tdName.textContent = transaction.name;
            tr.appendChild(tdName);

            var tdAmount = document.createElement('td');
            tdAmount.textContent = (transaction.type === "compra" ? "-" : "+") + transaction.amount;
            tr.appendChild(tdAmount);

            var tdDate = document.createElement('td');
            tdDate.textContent = transaction.date;
            tr.appendChild(tdDate);

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

