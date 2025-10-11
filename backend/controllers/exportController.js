import Expense from "../models/Expense.js";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import fs from "fs";

export const exportExpensesCSV = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user });
    const fields = ["date", "category", "amount", "description"];
    const parser = new Parser({ fields });
    const csv = parser.parse(expenses);

    res.header("Content-Type", "text/csv");
    res.attachment("expenses.csv");
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportExpensesPDF = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user });
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=expenses.pdf");

    doc.pipe(res);
    doc.fontSize(20).text("Expense Report", { align: "center" });
    doc.moveDown();

    expenses.forEach((e) => {
      doc.fontSize(12).text(`Date: ${e.date.toDateString()}`);
      doc.text(`Category: ${e.category}`);
      doc.text(`Amount: ₹${e.amount}`);
      doc.text(`Description: ${e.description}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
