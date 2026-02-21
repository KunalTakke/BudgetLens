import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = "budgetlens";

const categories = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Utilities",
  "Health",
  "Education",
  "Subscriptions",
  "Coffee",
  "Groceries",
];

const descriptions = {
  Food: [
    "Lunch at cafe",
    "Dinner takeout",
    "Pizza delivery",
    "Sushi restaurant",
    "Burger joint",
    "Thai food",
    "Sandwich shop",
    "Taco Tuesday",
  ],
  Transport: [
    "Uber ride",
    "Gas station",
    "Bus pass",
    "Parking fee",
    "Train ticket",
    "Lyft ride",
    "Toll fee",
    "Car wash",
  ],
  Entertainment: [
    "Movie tickets",
    "Concert",
    "Bowling night",
    "Video game",
    "Streaming service",
    "Arcade",
    "Mini golf",
    "Museum visit",
  ],
  Shopping: [
    "New shoes",
    "T-shirt",
    "Amazon order",
    "Phone case",
    "Backpack",
    "Headphones",
    "Jacket",
    "Books",
  ],
  Utilities: [
    "Electric bill",
    "Water bill",
    "Internet bill",
    "Phone bill",
    "Gas bill",
    "Trash service",
    "Heating bill",
    "Maintenance",
  ],
  Health: [
    "Pharmacy",
    "Gym membership",
    "Doctor visit",
    "Vitamins",
    "Eye checkup",
    "Dental cleaning",
    "First aid kit",
    "Yoga class",
  ],
  Education: [
    "Textbook",
    "Online course",
    "Study materials",
    "Printing",
    "Notebook",
    "Tutor session",
    "Workshop fee",
    "Lab supplies",
  ],
  Subscriptions: [
    "Netflix",
    "Spotify",
    "iCloud storage",
    "ChatGPT Plus",
    "Adobe Creative",
    "YouTube Premium",
    "Cloud backup",
    "News subscription",
  ],
  Coffee: [
    "Morning latte",
    "Iced coffee",
    "Espresso",
    "Cold brew",
    "Cappuccino",
    "Mocha",
    "Matcha latte",
    "Drip coffee",
  ],
  Groceries: [
    "Weekly groceries",
    "Fruits and veggies",
    "Milk and eggs",
    "Snacks",
    "Frozen meals",
    "Bread and pasta",
    "Drinks",
    "Cleaning supplies",
  ],
};

function randomBetween(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomDate(startMonth, endMonth) {
  const start = new Date(startMonth);
  const end = new Date(endMonth);
  const randomTime =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());
  const date = new Date(randomTime);
  return date.toISOString().split("T")[0];
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const amountRanges = {
  Food: [5, 45],
  Transport: [3, 50],
  Entertainment: [10, 80],
  Shopping: [10, 150],
  Utilities: [30, 200],
  Health: [10, 100],
  Education: [5, 80],
  Subscriptions: [5, 25],
  Coffee: [3, 8],
  Groceries: [20, 120],
};

async function seed() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    console.log("Connected to MongoDB for seeding...");

    await db.collection("expenses").deleteMany({});
    await db.collection("budgets").deleteMany({});
    console.log("Cleared existing data");

    const expenses = [];
    for (let i = 0; i < 1050; i++) {
      const category = pickRandom(categories);
      const [min, max] = amountRanges[category];
      expenses.push({
        amount: randomBetween(min, max),
        category: category,
        description: pickRandom(descriptions[category]),
        date: randomDate("2025-09-01", "2026-02-28"),
        createdAt: new Date().toISOString(),
      });
    }

    await db.collection("expenses").insertMany(expenses);
    console.log(`Inserted ${expenses.length} expense records`);

    const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
    const budgets = categories.map((category) => ({
      category: category,
      limit: randomBetween(100, 500),
      month: currentMonth,
      createdAt: new Date().toISOString(),
    }));

    await db.collection("budgets").insertMany(budgets);
    console.log(`Inserted ${budgets.length} budget records`);

    const expenseCount = await db.collection("expenses").countDocuments();
    const budgetCount = await db.collection("budgets").countDocuments();
    console.log(`\nTotal expenses in DB: ${expenseCount}`);
    console.log(`Total budgets in DB: ${budgetCount}`);
    console.log("Seeding complete!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await client.close();
  }
}

seed();
