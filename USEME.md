# BudgetLens - How to Use

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (free tier works)

### Installation

1. Clone the repository
   ```
   git clone <repo-url>
   cd BudgetLens
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root folder with your MongoDB connection string
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/budgetlens
   PORT=3000
   ```

4. Seed the database with sample data (1,050+ records)
   ```
   node --env-file=.env backend/seed.js
   ```

5. Start the server
   ```
   node --env-file=.env backend/app.js
   ```

6. Open your browser and go to `http://localhost:3000`

---

## Using the App

BudgetLens has three pages accessible from the navigation bar at the top: **Dashboard**, **Expenses**, and **Budgets**.

---

### Dashboard (Home Page)

The Dashboard is the first page you see when you open the app. It gives you a quick overview of your finances.

**What you will see:**

- **Stat Cards** — Four boxes at the top showing your total spending this month, your total budget, how much is remaining, and how many transactions you made.
- **Pie Chart** — A chart on the left showing your spending broken down by category (Food, Transport, Coffee, etc.). This helps you see which categories take up the most money.
- **Recent Expenses** — A list on the right showing your 5 most recent expenses with the description, category, date, and amount.
- **Budget Status** — Progress bars at the bottom for each budget category. Green means you are on track. Yellow means you are approaching your limit (80% or more). Red means you are over budget.

**How to use it:**

- Just open the app and the dashboard loads automatically.
- Use it to get a quick look at where you stand financially this month.
- Click "Expenses" or "Budgets" in the nav bar to manage your data.

---

### Expenses Page

The Expenses page is where you add, view, edit, and delete your expenses.

**How to add an expense:**

1. Click the **"+ Add Expense"** button at the top right.
2. A form will appear with four fields:
   - **Amount** — Enter the dollar amount (e.g., 12.50)
   - **Category** — Select a category from the dropdown (Food, Transport, Coffee, etc.)
   - **Description** — Type a short description (e.g., "Lunch at cafe")
   - **Date** — Pick the date (defaults to today)
3. Click **"Add Expense"** to save it.
4. The expense will immediately appear in the table below.

**How to edit an expense:**

1. Find the expense in the table.
2. Click the **"Edit"** button on that row.
3. The form at the top will fill in with the existing data.
4. Change whatever you need.
5. Click **"Update Expense"** to save your changes.

**How to delete an expense:**

1. Find the expense in the table.
2. Click the **"Delete"** button on that row.
3. A confirmation popup will ask "Are you sure?".
4. Click OK to delete it.

**How to filter expenses:**

1. Use the filter bar below the form:
   - **Category** — Select a specific category or "All Categories"
   - **Start Date** — Pick a start date
   - **End Date** — Pick an end date
2. Click **"Filter"** to apply.
3. The table and total will update to show only matching expenses.
4. Click **"Clear"** to reset all filters and show everything again.

**Total bar:**

- The total bar between the filters and the table shows the sum of all currently displayed expenses.

---

### Budgets Page

The Budgets page is where you set monthly spending limits for each category and track your progress.

**How to set a budget:**

1. Click the **"+ Set Budget"** button at the top right.
2. A form will appear with three fields:
   - **Category** — Select a category (Food, Transport, Coffee, etc.)
   - **Monthly Limit** — Enter the maximum amount you want to spend (e.g., 200.00)
   - **Month** — Select the month (defaults to the current month)
3. Click **"Set Budget"** to save it.
4. A budget card will appear below showing your progress.

**How to edit a budget:**

1. Find the budget card you want to change.
2. Click the **"Edit"** button on that card.
3. The form will fill in with the existing data.
4. Change the limit or other fields.
5. Click **"Update Budget"** to save.

**How to delete a budget:**

1. Find the budget card.
2. Click the **"Delete"** button.
3. Confirm the deletion in the popup.

**Understanding budget cards:**

Each budget card shows:
- **Category name** and **month** at the top
- **Spent** — How much you have spent in that category this month
- **Limit** — The budget limit you set
- **Progress bar** — Visual indicator of how much of the budget is used
- **Percentage** — The exact percentage used
- **Status colors:**
  - Green = On track (under 80%)
  - Yellow = Warning (80% to 99%)
  - Red = Over budget (100% or more)

**Alerts:**

- At the top of the page, you will see alert boxes for any category that is at 80% or more of its budget.
- Yellow alerts mean you are approaching the limit.
- Red alerts mean you have gone over the limit.
- These alerts update automatically based on your expenses.

**Monthly Summary:**

- Below the form, four summary stats show your total budget, total spent, how many categories are on track, and how many are over budget.
