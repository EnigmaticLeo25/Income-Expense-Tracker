document.addEventListener('DOMContentLoaded', function() {
    const transactionForm = document.getElementById('transactionForm');
    const transactionList = document.getElementById('transactionList');
    const totalIncome = document.getElementById('totalIncome');
    const totalExpenses = document.getElementById('totalExpenses');
    const balance = document.getElementById('balance');
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    function updateSummary() {
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const balanceAmount = income - expenses;

        totalIncome.textContent = formatCurrency(income);
        totalExpenses.textContent = formatCurrency(expenses);
        balance.textContent = formatCurrency(balanceAmount);
    }

    function formatCurrency(amount) {
        return '$' + amount.toFixed(2);
    }

    function renderTransactions() {
        transactionList.innerHTML = '';
        transactions.forEach((transaction, index) => {
            const li = document.createElement('li');
            li.classList.add(transaction.type);
            li.innerHTML = `
                <span>${transaction.name}: ${formatCurrency(transaction.amount)}</span>
                <button onclick="deleteTransaction(${index})">Delete</button>
            `;
            transactionList.appendChild(li);
        });
        updateSummary();
    }

    function addTransaction(name, amount, type) {
        transactions.push({ name, amount: parseFloat(amount), type });
        localStorage.setItem('transactions', JSON.stringify(transactions));
        renderTransactions();
    }

    window.deleteTransaction = function(index) {
        transactions.splice(index, 1);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        renderTransactions();
    };

    transactionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('transactionName').value.trim();
        const amount = document.getElementById('transactionAmount').value;
        const type = document.getElementById('transactionType').value;
        if (name && amount) {
            addTransaction(name, amount, type);
            transactionForm.reset();
        }
    });

    renderTransactions();
});