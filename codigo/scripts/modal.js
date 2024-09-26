document.addEventListener('DOMContentLoaded', function () {
    // Seleciona o botão e o modal
    const modal = document.getElementById('modal');
    const newDepositButton = document.getElementById('new-deposit');
    const closeModal = document.querySelector('.close');

    // Abrir o modal quando o botão "Novo aporte" for clicado
    newDepositButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Fechar o modal quando o ícone de fechar for clicado
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Fechar o modal se o usuário clicar fora do conteúdo do modal
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});