import { Router } from "express";
import {
  getAllBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetsWithSpending,
} from "../db/budget.js";

const router = Router();

router.get("/", async (req, res) => {
  try { 
    const budgets = await getAllBudgets();
    res.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
});

router.get("/status", async (req, res) => {
  try {
    const budgets = await getBudgetsWithSpending();
    res.json(budgets);
  } catch (error) {
    console.error("Error fetching budget status:", error);
    res.status(500).json({ error: "Failed to fetch budget status" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const budget = await getBudgetById(req.params.id);
    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }
    res.json(budget);
  } catch (error) {
    console.error("Error fetching budget:", error);
    res.status(500).json({ error: "Failed to fetch budget" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { category, limit, month } = req.body;

    if (!category || !limit || !month) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const budget = await createBudget({ category, limit, month });
    res.status(201).json(budget);
  } catch (error) {
    console.error("Error creating budget:", error);
    res.status(500).json({ error: "Failed to create budget" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { category, limit, month } = req.body;

    if (!category || !limit || !month) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const budget = await updateBudget(req.params.id, {
      category,
      limit,
      month,
    });
    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }
    res.json(budget);
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ error: "Failed to update budget" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deleteBudget(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Budget not found" });
    }
    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Error deleting budget:", error);
    res.status(500).json({ error: "Failed to delete budget" });
  }
});

export default router;