import { ObjectId } from "mongodb";
import { getDB } from "./connection.js";

function getBudgetsCollection() {
  return getDB().collection("budgets");
}

async function getAllBudgets() {
  const collection = getBudgetsCollection();
  return await collection.find({}).sort({ category: 1 }).toArray();
}

async function getBudgetById(id) {
  const collection = getBudgetsCollection();
  return await collection.findOne({ _id: new ObjectId(id) });
}

async function createBudget(budget) {
  const collection = getBudgetsCollection();
  const newBudget = {
    category: budget.category,
    limit: parseFloat(budget.limit),
    month: budget.month,
    createdAt: new Date().toISOString(),
  };
  const result = await collection.insertOne(newBudget);
  return { ...newBudget, _id: result.insertedId };
}

async function updateBudget(id, updates) {
  const collection = getBudgetsCollection();
  const updateData = {
    category: updates.category,
    limit: parseFloat(updates.limit),
    month: updates.month,
  };
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" },
  );
  return result;
}

async function deleteBudget(id) {
  const collection = getBudgetsCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

async function getBudgetsWithSpending() {
  const db = getDB();
  const budgets = await getBudgetsCollection()
    .find({})
    .sort({ category: 1 })
    .toArray();

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const firstOfMonth = `${currentMonth}-01`;
  const lastOfMonth = `${currentMonth}-31`;

  const expenses = await db
    .collection("expenses")
    .find({ date: { $gte: firstOfMonth, $lte: lastOfMonth } })
    .toArray();

  const spendingByCategory = {};
  expenses.forEach((exp) => {
    if (!spendingByCategory[exp.category]) {
      spendingByCategory[exp.category] = 0;
    }
    spendingByCategory[exp.category] += exp.amount;
  });

  return budgets.map((budget) => {
    const spent = spendingByCategory[budget.category] || 0;
    const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
    let status = "good";
    if (percentage >= 100) {
      status = "over";
    } else if (percentage >= 80) {
      status = "warning";
    }
    return {
      ...budget,
      spent: Math.round(spent * 100) / 100,
      percentage: Math.round(percentage),
      status,
    };
  });
}

export {
  getAllBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetsWithSpending,
};
