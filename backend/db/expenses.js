import { ObjectId } from "mongodb";
import { getDB } from "./connection.js";

function getExpensesCollection() {
  return getDB().collection("expenses");
}

async function getAllExpenses() {
  const collection = getExpensesCollection();
  return await collection.find({}).sort({ date: -1 }).toArray();
}

async function getExpenseById(id) {
  const collection = getExpensesCollection();
  return await collection.findOne({ _id: new ObjectId(id) });
}

async function createExpense(expense) {
  const collection = getExpensesCollection();
  const newExpense = {
    amount: parseFloat(expense.amount),
    category: expense.category,
    description: expense.description,
    date: expense.date,
    createdAt: new Date().toISOString(),
  };
  const result = await collection.insertOne(newExpense);
  return { ...newExpense, _id: result.insertedId };
}

async function updateExpense(id, updates) {
  const collection = getExpensesCollection();
  const updateData = {
    amount: parseFloat(updates.amount),
    category: updates.category,
    description: updates.description,
    date: updates.date,
  };
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" },
  );
  return result;
}

async function deleteExpense(id) {
  const collection = getExpensesCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

async function getExpensesFiltered(filters) {
  const collection = getExpensesCollection();
  const query = {};

  if (filters.category && filters.category !== "all") {
    query.category = filters.category;
  }

  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) {
      query.date.$gte = filters.startDate;
    }
    if (filters.endDate) {
      query.date.$lte = filters.endDate;
    }
  }

  return await collection.find(query).sort({ date: -1 }).toArray();
}

async function getExpensesSummary() {
  const collection = getExpensesCollection();

  const now = new Date();
  const firstOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  const monthlyExpenses = await collection
    .find({ date: { $gte: firstOfMonth } })
    .toArray();

  const totalThisMonth = monthlyExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0,
  );

  const categoryTotals = {};
  monthlyExpenses.forEach((exp) => {
    if (!categoryTotals[exp.category]) {
      categoryTotals[exp.category] = 0;
    }
    categoryTotals[exp.category] += exp.amount;
  });

  const recentExpenses = await collection
    .find({})
    .sort({ date: -1 })
    .limit(5)
    .toArray();

  return {
    totalThisMonth: Math.round(totalThisMonth * 100) / 100,
    categoryTotals,
    recentExpenses,
    transactionCount: monthlyExpenses.length,
  };
}

export {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpensesFiltered,
  getExpensesSummary,
};
