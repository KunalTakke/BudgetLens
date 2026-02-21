import { Router } from "express";
import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpensesFiltered,
  getExpensesSummary,
} from "../db/expenses.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;

    if (category || startDate || endDate) {
      const expenses = await getExpensesFiltered({
        category,
        startDate,
        endDate,
      });
      return res.json(expenses);
    }

    const expenses = await getAllExpenses();
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

router.get("/summary", async (req, res) => {
  try {
    const summary = await getExpensesSummary();
    res.json(summary);
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const expense = await getExpenseById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error);
    res.status(500).json({ error: "Failed to fetch expense" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;

    if (!amount || !category || !description || !date) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const expense = await createExpense({
      amount,
      category,
      description,
      date,
    });
    res.status(201).json(expense);
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ error: "Failed to create expense" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;

    if (!amount || !category || !description || !date) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const expense = await updateExpense(req.params.id, {
      amount,
      category,
      description,
      date,
    });
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ error: "Failed to update expense" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deleteExpense(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

export default router;
