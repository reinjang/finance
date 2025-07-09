import React from "react";

export default function InputCard({ form, setForm, onSubmit }) {
  return (
    <div className="card">
      <h2>Financial Input</h2>
      <div className="space-y-3">
        <div>
          <label>Net Worth:</label>
          <input
            type="number"
            value={form.networth}
            onChange={e => setForm(f => ({ ...f, networth: e.target.value }))}
            placeholder="Enter your net worth"
            required
          />
        </div>
        <div>
          <label>Monthly Income:</label>
          <input
            type="number"
            value={form.income}
            onChange={e => setForm(f => ({ ...f, income: e.target.value }))}
            placeholder="Enter monthly income"
            required
          />
        </div>
        <div>
          <label>Monthly Expenses:</label>
          <input
            type="number"
            value={form.expenses}
            onChange={e => setForm(f => ({ ...f, expenses: e.target.value }))}
            placeholder="Enter monthly expenses"
            required
          />
        </div>
      </div>
    </div>
  );
}