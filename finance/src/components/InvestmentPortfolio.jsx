import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

export default function InvestmentPortfolio({ investments, setInvestments, onChange }) {
  const [input, setInput] = useState({ name: "", ratio: "", performance: "" });

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

  // Pie chart data
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
            size: 13
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
            
            // Find the investment details
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

  return (
    <div className="card h-full flex flex-col">
      <h2>Investment Portfolio</h2>
      <div className="flex-1 flex flex-col min-h-0">
        <div style={{ height: '55%', marginBottom: '0.2rem' }}>
          <Pie data={pieData} options={chartOptions} />
        </div>
        
        <div className="space-y-1 flex-shrink-0">
          <input
            type="text"
            placeholder="Investment name"
            value={input.name}
            onChange={e => setInput(i => ({ ...i, name: e.target.value }))}
            required
          />
          <input
            type="number"
            placeholder="% of total holding"
            min={1}
            max={100}
            value={input.ratio}
            onChange={e => setInput(i => ({ ...i, ratio: e.target.value }))}
            required
          />
          <input
            type="number"
            placeholder="Estimated performance (%)"
            value={input.performance}
            onChange={e => setInput(i => ({ ...i, performance: e.target.value }))}
            required
          />
          <div className="w-full">
            <button type="button" className="primary-action w-full" onClick={handleAdd}>
              Add Investment
            </button>
          </div>
        </div>
        
        {investments.length > 0 && (
          <ul className="flex-1 overflow-y-auto mt-1 min-h-0">
            {investments.map((inv, idx) => (
              <li key={idx}>
                <span>
                  <b>{inv.name}</b> - {inv.ratio}% - {inv.performance}%
                </span>
                <button
                  onClick={() => handleRemove(idx)}
                  type="button"
                  style={{ background: '#f87171', color: '#fff', borderRadius: '0.5rem', padding: '0.2rem 0.7rem', fontWeight: 600, fontSize: '0.9rem', boxShadow: '0 1px 4px #f8717122', border: 'none', transition: 'background 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background = '#ef4444'}
                  onMouseOut={e => e.currentTarget.style.background = '#f87171'}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        
        {totalRatio > 100 && (
          <div className="text-red-400 mt-0.5 text-xs flex-shrink-0">
            Total allocation cannot exceed 100%.
          </div>
        )}
        
        {totalRatio < 100 && investments.length > 0 && (
          <div className="text-zinc-400 mt-0.5 text-xs flex-shrink-0">
            {100 - totalRatio}% unallocated
          </div>
        )}
      </div>
    </div>
  );
}