const toggleFormBtn = document.getElementById("toggleFormBtn");
const formSection = document.getElementById("budgetFormSection");
const budgetForm = document.getElementById("budgetForm");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const budgetIdInput = document.getElementById("budgetId");
const budgetCards = document.getElementById("budgetCards");
const noDataMessage = document.getElementById("noDataMessage");
const alertsList = document.getElementById("alertsList");
const summaryStats = document.getElementById("summaryStats");
const alertsSection = document.getElementById("alertsSection");

const now = new Date();
const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
document.getElementById("budgetMonth").value = currentMonth;

toggleFormBtn.addEventListener("click", () => {
  resetForm();
  formSection.classList.toggle("hidden");
});

cancelBtn.addEventListener("click", () => {
  resetForm();
  formSection.classList.add("hidden");
});

function resetForm() {
  budgetForm.reset();
  budgetIdInput.value = "";
  formTitle.textContent = "Set New Budget";
  submitBtn.textContent = "Set Budget";
  document.getElementById("budgetMonth").value = currentMonth;
}

async function loadBudgets() {
  try {
    const response = await fetch("/api/budgets/status");
    const budgets = await response.json();
    renderBudgetCards(budgets);
    renderAlerts(budgets);
    renderSummary(budgets);
  } catch (error) {
    console.error("Error loading budgets:", error);
  }
}

function renderBudgetCards(budgets) {
  if (budgets.length === 0) {
    budgetCards.innerHTML = "";
    noDataMessage.classList.remove("hidden");
    return;
  }

  noDataMessage.classList.add("hidden");

  budgetCards.innerHTML = budgets
    .map(
      (budget) => `
    <div class="budget-card">
      <div class="budget-card-header">
        <h3>${budget.category}</h3>
        <span class="month-label">${budget.month}</span>
      </div>
      <div class="budget-amounts">
        <span class="spent">Spent: $${budget.spent.toFixed(2)}</span>
        <span class="limit">Limit: $${budget.limit.toFixed(2)}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill ${budget.status}" style="width: ${Math.min(budget.percentage, 100)}%"></div>
      </div>
      <div class="percentage ${budget.status}">${budget.percentage}% used</div>
      <div class="budget-actions">
        <button class="primary" onclick="editBudget('${budget._id}')">Edit</button>
        <button class="danger" onclick="removeBudget('${budget._id}')">Delete</button>
      </div>
    </div>
  `,
    )
    .join("");
}

function renderAlerts(budgets) {
  const alerts = budgets.filter(
    (b) => b.status === "warning" || b.status === "over",
  );

  if (alerts.length === 0) {
    alertsSection.classList.add("hidden");
    return;
  }

  alertsSection.classList.remove("hidden");

  alertsList.innerHTML = alerts
    .map((budget) => {
      if (budget.status === "over") {
        return `<div class="budget-alert over">
          <strong>${budget.category}:</strong> Over budget! You've spent $${budget.spent.toFixed(2)} of your $${budget.limit.toFixed(2)} limit (${budget.percentage}%).
        </div>`;
      }
      return `<div class="budget-alert warning">
        <strong>${budget.category}:</strong> Approaching limit! You've spent $${budget.spent.toFixed(2)} of your $${budget.limit.toFixed(2)} limit (${budget.percentage}%).
      </div>`;
    })
    .join("");
}

function renderSummary(budgets) {
  if (budgets.length === 0) {
    summaryStats.innerHTML = "<p>No budget data available</p>";
    return;
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const onTrack = budgets.filter((b) => b.status === "good").length;
  const overBudget = budgets.filter((b) => b.status === "over").length;

  summaryStats.innerHTML = `
    <div class="summary-stat">
      <div class="value">$${totalBudget.toFixed(2)}</div>
      <div class="label">Total Budget</div>
    </div>
    <div class="summary-stat">
      <div class="value">$${totalSpent.toFixed(2)}</div>
      <div class="label">Total Spent</div>
    </div>
    <div class="summary-stat">
      <div class="value">${onTrack}</div>
      <div class="label">On Track</div>
    </div>
    <div class="summary-stat">
      <div class="value">${overBudget}</div>
      <div class="label">Over Budget</div>
    </div>
  `;
}

budgetForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const budgetData = {
    category: document.getElementById("budgetCategory").value,
    limit: document.getElementById("budgetLimit").value,
    month: document.getElementById("budgetMonth").value,
  };

  const id = budgetIdInput.value;

  try {
    if (id) {
      await fetch(`/api/budgets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budgetData),
      });
    } else {
      await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budgetData),
      });
    }

    resetForm();
    formSection.classList.add("hidden");
    loadBudgets();
  } catch (error) {
    console.error("Error saving budget:", error);
  }
});

window.editBudget = async function (id) {
  try {
    const response = await fetch(`/api/budgets/${id}`);
    const budget = await response.json();

    budgetIdInput.value = budget._id;
    document.getElementById("budgetCategory").value = budget.category;
    document.getElementById("budgetLimit").value = budget.limit;
    document.getElementById("budgetMonth").value = budget.month;

    formTitle.textContent = "Edit Budget";
    submitBtn.textContent = "Update Budget";
    formSection.classList.remove("hidden");

    formSection.scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.error("Error fetching budget:", error);
  }
};

window.removeBudget = async function (id) {
  if (!confirm("Are you sure you want to delete this budget?")) return;

  try {
    await fetch(`/api/budgets/${id}`, { method: "DELETE" });
    loadBudgets();
  } catch (error) {
    console.error("Error deleting budget:", error);
  }
};

loadBudgets();
