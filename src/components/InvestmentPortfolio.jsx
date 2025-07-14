import React, { useState, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

export default function InvestmentPortfolio({ investments, setInvestments, onChange }) {
  const [input, setInput] = useState({ name: "", ratio: "", performance: "" });
  const pieRef = useRef();

  const totalRatio = investments.reduce((sum, inv) => sum + Number(inv.ratio), 0);

  const investmentColors = [
    '#818cf8', '#38bdf8', '#fbbf24', '#f472b6', '#34d399', '#f87171', '#a3e635', '#facc15', '#e5e7eb', '#6366f1', '#06b6d4', '#84cc16', '#f59e42', '#e879f9', '#f43f5e'
  ];

  const handleAdd = e => {
    e.preventDefault();
    if (
      !input.name ||
      !input.ratio ||
      !input.performance ||
      totalRatio + Number(input.ratio) > 100
    )
      return;
    setInvestments([...investments, { ...input }]);
    setInput({ name: "", ratio: "", performance: "" });
    onChange && onChange();
  };

  const handleRemove = idx => {
    setInvestments(investments.filter((_, i) => i !== idx));
    onChange && onChange();
  };

  const matchIdx = investments.findIndex(inv => inv.name.trim().toLowerCase() === input.name.trim().toLowerCase());

  const handleSave = () => {
    if (matchIdx === -1) return;
    const updated = investments.map((inv, idx) =>
      idx === matchIdx ? { ...inv, ratio: input.ratio, performance: input.performance } : inv
    );
    setInvestments(updated);
    setInput({ name: '', ratio: '', performance: '' });
    onChange && onChange();
  };

  const handleRemoveSelected = () => {
    if (matchIdx === -1) return;
    setInvestments(investments.filter((_, idx) => idx !== matchIdx));
    setInput({ name: '', ratio: '', performance: '' });
    onChange && onChange();
  };

  const pieData = {
    labels: investments.length
      ? investments.map(inv => inv.name).concat(
          totalRatio < 100 ? ["Unallocated"] : []
        )
      : ["Unallocated"],
    datasets: [
      {
        data: investments.length
          ? investments.map(inv => Number(inv.ratio)).concat(
              totalRatio < 100 ? [100 - totalRatio] : []
            )
          : [100],
        backgroundColor: investments.length
          ? investments.map((inv, idx) => investmentColors[idx % investmentColors.length])
              .concat(totalRatio < 100 ? ['#e5e7eb'] : [])
          : ['#e5e7eb'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#22223B',
          font: {
            size: 10
          }
        }
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#22223B',
        bodyColor: '#495057',
        borderColor: '#b6c6e3',
        borderWidth: 1,
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            const label = context.label;
            const value = context.parsed;
            if (label === "Unallocated") {
              return `${value}% - No investment allocation`;
            }
            const investment = investments.find(inv => inv.name === label);
            if (investment) {
              return [
                `Allocation: ${value}%`,
                `Expected Performance: ${investment.performance}%`
              ];
            }
            return `${value}%`;
          }
        }
      }
    }
  };

  const handlePieClick = (event) => {
    const chart = pieRef.current;
    if (!chart) return;
    const elements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
    if (elements.length > 0) {
      const idx = elements[0].index;
      if (investments.length && idx < investments.length) {
        const inv = investments[idx];
        setInput({ name: inv.name, ratio: inv.ratio, performance: inv.performance });
      }
    }
  };

  return (
    <div className="card p-2 pb-1 mb-1">
      <h2 className="text-xs font-bold mb-1">Investment Portfolio</h2>
      <div className="flex-1 flex flex-col min-h-0">
        <div style={{ height: '45%', marginBottom: '0.1rem' }}>
          <Pie ref={pieRef} data={pieData} options={chartOptions} onClick={handlePieClick} />
        </div>
        <div className="space-y-0.5 flex-shrink-0">
          <input
            type="text"
            placeholder="Investment name"
            className="text-xs px-1 py-0.5 mb-0.5"
            value={input.name}
            onChange={e => setInput(i => ({ ...i, name: e.target.value }))}
            required
          />
          <input
            type="number"
            placeholder="% of total holding"
            min={1}
            max={100}
            className="text-xs px-1 py-0.5 mb-0.5"
            value={input.ratio}
            onChange={e => setInput(i => ({ ...i, ratio: e.target.value }))}
            required
          />
          <input
            type="number"
            placeholder="Estimated performance (%)"
            className="text-xs px-1 py-0.5 mb-0.5"
            value={input.performance}
            onChange={e => setInput(i => ({ ...i, performance: e.target.value }))}
            required
          />
          <div className="w-full flex gap-1">
            {matchIdx !== -1 && input.name.trim() ? (
              <>
                <button type="button" className="danger w-1/2 text-xs py-0.5" onClick={handleRemoveSelected}>
                  Remove
                </button>
                <button type="button" className="primary-action w-1/2 text-xs py-0.5" onClick={handleSave}>
                  Save
                </button>
              </>
            ) : (
              <button type="button" className="primary-action w-full text-xs py-0.5" onClick={handleAdd}>
                Add
              </button>
            )}
          </div>
        </div>
        {totalRatio > 100 && (
          <div className="text-red-400 mt-0.5 text-xs flex-shrink-0">
            Total allocation cannot exceed 100%.
          </div>
        )}
      </div>
    </div>
  );
}