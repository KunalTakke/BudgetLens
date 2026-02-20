const statsGrid = document.getElementById("statsGrid");
const recentExpensesDiv = document.getElementById("recentExpenses");
const budgetBarsDiv = document.getElementById("budgetBars");

let categoryChartInstance = null;


const categoryColors = {
  Food: "#e74c3c",
  Transport: "#3498db",
  Entertainment: "#9b59b6",
  Shopping: "#e67e22",
  Utilities: "#1abc9c",
  Health: "#2ecc71",
  Education: "#f1c40f",
  Subscriptions: "#34495e",
  Coffee: "#d35400",
  Groceries: "#27ae60",
};

async function loadDashboard() {
  try {
    const [summaryRes, budgetRes] = await Promise.all([
      fetch("/api/expenses/summary"),
      fetch("/api/budgets/status"),
    ]);

    const summary = await summaryRes.json();
    const budgets = await budgetRes.json();

    renderStats(summary, budgets);
    renderCategoryChart(summary.categoryTotals);
    renderRecentExpenses(summary.recentExpenses);
    renderBudgetBars(budgets);
  } catch (error) {
    console.error("Error loading dashboard:", error);
  }
}

function renderStats(summary, budgets) {
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = summary.totalThisMonth;
  const remaining = Math.max(0, totalBudget - totalSpent);

  statsGrid.innerHTML = `
    <div class="stat-card">
      <h3>Spent This Month</h3>
      <div class="stat-value">$${totalSpent.toFixed(2)}</div>
    </div>
    <div class="stat-card">
      <h3>Total Budget</h3>
      <div class="stat-value">$${totalBudget.toFixed(2)}</div>
    </div>
    <div class="stat-card">
      <h3>Remaining</h3>
      <div class="stat-value">$${remaining.toFixed(2)}</div>
    </div>
    <div class="stat-card">
      <h3>Transactions</h3>
      <div class="stat-value">${summary.transactionCount}</div>
    </div>
  `;
}

function renderCategoryChart(categoryTotals) {
  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);
  const colors = labels.map((cat) => categoryColors[cat] || "#95a5a6");

  if (categoryChartInstance) {
    categoryChartInstance.destroy();
  }

  const ctx = document.getElementById("categoryChart").getContext("2d");
  categoryChartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 15,
            font: { size: 12 },
          },
        },
      },
    },
  });
}

function renderRecentExpenses(expenses) {
  if (expenses.length === 0) {
    recentExpensesDiv.innerHTML =
      '<p class="no-data">No recent expenses</p>';
    return;
  }

  recentExpensesDiv.innerHTML = expenses
    .map(
      (exp) => `
    <div class="recent-item">
      <div>
        <div class="description">${exp.description}</div>
        <div class="category">${exp.category} &middot; ${exp.date}</div>
      </div>
      <div class="amount">-$${exp.amount.toFixed(2)}</div>
    </div>
  `,
    )
    .join("");
}

function renderBudgetBars(budgets) {
  if (budgets.length === 0) {
    budgetBarsDiv.innerHTML =
      '<p class="no-data">No budgets set yet</p>';
    return;
  }

  budgetBarsDiv.innerHTML = budgets
    .map(
      (budget) => `
    <div class="budget-bar-item">
      <div class="bar-header">
        <span>${budget.category}</span>
        <span>$${budget.spent.toFixed(2)} / $${budget.limit.toFixed(2)}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill ${budget.status}" style="width: ${Math.min(budget.percentage, 100)}%"></div>
      </div>
    </div>
  `,
    )
    .join("");
}


loadDashboard();