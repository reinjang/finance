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
    <div className="card p-3 pb-2 mb-2 text-base">
      <h2 className="text-base font-bold mb-2">Financial Input</h2>
      <div className="space-y-2">
        <div>
          <label className="text-base font-semibold mb-1">Net Worth:</label>
          <input
            type="text"
            inputMode="numeric"
            className="text-base px-3 py-2 mb-2"
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
          <label className="text-base font-semibold mb-1">Monthly Income:</label>
          <input
            type="text"
            inputMode="numeric"
            className="text-base px-3 py-2 mb-2"
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
          <label className="text-base font-semibold mb-1">Monthly Expenses:</label>
          <input
            type="text"
            inputMode="numeric"
            className="text-base px-3 py-2 mb-2"
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
          className="primary-action w-full text-base py-2 mt-2"
          type="button"
          onClick={onSubmit}
        >
          Calculate
        </button>
      </div>
    </div>
  );
}