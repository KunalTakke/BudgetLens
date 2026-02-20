import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { connectDB } from "./db/connection.js";
import expenseRoutes from "./routes/expenses.js";
import budgetRoutes from "./routes/budget.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(join(__dirname, "..", "frontend")));


app.use("/api/expenses", expenseRoutes);
app.use("/api/budgets", budgetRoutes);


async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`BudgetLens server running at http://localhost:${PORT}`);
  });
}

startServer();