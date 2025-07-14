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
    <div className="card p-2 pb-1 mb-1">
      <h2 className="text-xs font-bold mb-1">Financial Input</h2>
      <div className="space-y-0.5">
        <div>
          <label className="text-xs font-semibold mb-0.5">Net Worth:</label>
          <input
            type="text"
            inputMode="numeric"
            className="text-xs px-1 py-0.5 mb-0.5"
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
          <label className="text-xs font-semibold mb-0.5">Monthly Income:</label>
          <input
            type="text"
            inputMode="numeric"
            className="text-xs px-1 py-0.5 mb-0.5"
            value={formatNumber(form.income)}
            onChange={e => {
              const raw = parseNumber(e.target.value);
              setForm(f => ({ ...f, income: raw }));
            }}
            placeholder="Enter your income"
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold mb-0.5">Monthly Expenses:</label>
          <input
            type="text"
            inputMode="numeric"
            className="text-xs px-1 py-0.5 mb-0.5"
            value={formatNumber(form.expenses)}
            onChange={e => {
              const raw = parseNumber(e.target.value);
              setForm(f => ({ ...f, expenses: raw }));
            }}
            placeholder="Enter your expenses"
            required
          />
        </div>
        <button
          className="primary-action w-full text-xs py-1 mt-1"
          type="button"
          onClick={onSubmit}
        >
          Calculate
        </button>
      </div>
    </div>
  );
}