import React from "react";

function formatNumber(value) {
  if (value === undefined || value === null || value === "") return "";
  const num = Number(value.toString().replace(/\./g, ""));
  if (isNaN(num)) return "";
  return num.toLocaleString('de-DE');
}

function parseNumber(str) {
  if (!str) return "";
  return str.replace(/\./g, "");
}

export default function InputCard({ form, setForm, onSubmit }) {
  return (
    <div className="card">
      <h2>Financial Input</h2>
      <div className="space-y-3">
        <div>
          <label>Net Worth:</label>
          <input
            type="text"
            inputMode="numeric"
            value={formatNumber(form.networth)}
            onChange={e => {
              const raw = parseNumber(e.target.value);
              setForm(f => ({ ...f, networth: raw }));
            }}
            placeholder="Enter your net worth"
            required
          />
        </div>
        <div>
          <label>Monthly Income:</label>
          <input
            type="text"
            inputMode="numeric"
            value={formatNumber(form.income)}
            onChange={e => {
              const raw = parseNumber(e.target.value);
              setForm(f => ({ ...f, income: raw }));
            }}
            placeholder="Enter monthly income"
            required
          />
        </div>
        <div>
          <label>Monthly Expenses:</label>
          <input
            type="text"
            inputMode="numeric"
            value={formatNumber(form.expenses)}
            onChange={e => {
              const raw = parseNumber(e.target.value);
              setForm(f => ({ ...f, expenses: raw }));
            }}
            placeholder="Enter monthly expenses"
            required
          />
        </div>
      </div>
    </div>
  );
}