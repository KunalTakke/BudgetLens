const toggleFormBtn = document.getElementById("toggleFormBtn");
const formSection = document.getElementById("expenseFormSection");
const expenseForm = document.getElementById("expenseForm");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const expenseIdInput = document.getElementById("expenseId");
const tableBody = document.getElementById("expensesTableBody");
const noDataMessage = document.getElementById("noDataMessage");
const totalAmount = document.getElementById("totalAmount");


const filterCategory = document.getElementById("filterCategory");
const filterStartDate = document.getElementById("filterStartDate");
const filterEndDate = document.getElementById("filterEndDate");
const applyFilterBtn = document.getElementById("applyFilterBtn");
const clearFilterBtn = document.getElementById("clearFilterBtn");


document.getElementById("date").valueAsDate = new Date();


toggleFormBtn.addEventListener("click", () => {
  resetForm();
  formSection.classList.toggle("hidden");
});

cancelBtn.addEventListener("click", () => {
  resetForm();
  formSection.classList.add("hidden");
});

function resetForm() {
  expenseForm.reset();
  expenseIdInput.value = "";
  formTitle.textContent = "Add New Expense";
  submitBtn.textContent = "Add Expense";
  document.getElementById("date").valueAsDate = new Date();
}


async function loadExpenses(filters = {}) {
  try {
    let url = "/api/expenses";
    const params = new URLSearchParams();

    if (filters.category && filters.category !== "all") {
      params.append("category", filters.category);
    }
    if (filters.startDate) {
      params.append("startDate", filters.startDate);
    }
    if (filters.endDate) {
      params.append("endDate", filters.endDate);
    }

    if (params.toString()) {
      url += "?" + params.toString();
    }

    const response = await fetch(url);
    const expenses = await response.json();
    renderExpenses(expenses);
  } catch (error) {
    console.error("Error loading expenses:", error);
  }
}

function renderExpenses(expenses) {
  if (expenses.length === 0) {
    tableBody.innerHTML = "";
    noDataMessage.classList.remove("hidden");
    totalAmount.textContent = "$0.00";
    return;
  }

  noDataMessage.classList.add("hidden");

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  totalAmount.textContent = `$${total.toFixed(2)}`;

  tableBody.innerHTML = expenses
    .map(
      (exp) => `
    <tr>
      <td>${exp.date}</td>
      <td>${exp.description}</td>
      <td><span class="badge">${exp.category}</span></td>
      <td>$${exp.amount.toFixed(2)}</td>
      <td>
        <div class="actions">
          <button class="primary" onclick="editExpense('${exp._id}')">Edit</button>
          <button class="danger" onclick="removeExpense('${exp._id}')">Delete</button>
        </div>
      </td>
    </tr>
  `,
    )
    .join("");
}


expenseForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const expenseData = {
    amount: document.getElementById("amount").value,
    category: document.getElementById("category").value,
    description: document.getElementById("description").value,
    date: document.getElementById("date").value,
  };

  const id = expenseIdInput.value;

  try {
    if (id) {

      await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });
    } else {

      await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });
    }

    resetForm();
    formSection.classList.add("hidden");
    loadExpenses();
  } catch (error) {
    console.error("Error saving expense:", error);
  }
});


window.editExpense = async function (id) {
  try {
    const response = await fetch(`/api/expenses/${id}`);
    const expense = await response.json();

    expenseIdInput.value = expense._id;
    document.getElementById("amount").value = expense.amount;
    document.getElementById("category").value = expense.category;
    document.getElementById("description").value = expense.description;
    document.getElementById("date").value = expense.date;

    formTitle.textContent = "Edit Expense";
    submitBtn.textContent = "Update Expense";
    formSection.classList.remove("hidden");

    formSection.scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.error("Error fetching expense:", error);
  }
};


window.removeExpense = async function (id) {
  if (!confirm("Are you sure you want to delete this expense?")) return;

  try {
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    loadExpenses();
  } catch (error) {
    console.error("Error deleting expense:", error);
  }
};


applyFilterBtn.addEventListener("click", () => {
  loadExpenses({
    category: filterCategory.value,
    startDate: filterStartDate.value,
    endDate: filterEndDate.value,
  });
});

clearFilterBtn.addEventListener("click", () => {
  filterCategory.value = "all";
  filterStartDate.value = "";
  filterEndDate.value = "";
  loadExpenses();
});


loadExpenses();