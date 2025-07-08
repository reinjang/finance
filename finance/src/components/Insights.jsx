import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js";
Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function Insights({ form, investments, apiResult, setApiResult, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if all required data is present
    const hasNetWorth = form.networth && Number(form.networth) > 0;
    const hasIncome = form.income && Number(form.income) > 0;
    const hasExpenses = form.expenses && Number(form.expenses) > 0;
    const hasInvestments = investments.length > 0;
    
    console.log('Data validation:', {
      hasNetWorth,
      hasIncome,
      hasExpenses,
      hasInvestments,
      form,
      investments
    });

    if (!hasNetWorth || !hasIncome || !hasExpenses) {
      setApiResult(null);
      setError(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const totalAllocated = investments.reduce((sum, inv) => sum + Number(inv.ratio), 0);
    let investmentsForApi = investments.map(inv => ({
      elementname: inv.name,
      elementratio: Number(inv.ratio),
      elementperformance: Number(inv.performance),
    }));
    if (totalAllocated < 100) {
      investmentsForApi.push({
        elementname: 'Unallocated',
        elementratio: 100 - totalAllocated,
        elementperformance: 0,
      });
    }
    const requestData = {
      networth: Number(form.networth),
      income: Number(form.income),
      expenses: Number(form.expenses),
      investments: investmentsForApi,
    };

    console.log('Making API request with data:', requestData);
    
    fetch("http://127.0.0.1:8000/multiply_dict/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    })
      .then(res => {
        console.log('API response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('API response data:', data);
        setApiResult(data.result || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('API Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [form, investments, setApiResult]);

  const investmentColors = [
    '#818cf8', '#38bdf8', '#fbbf24', '#f472b6', '#34d399', '#f87171', '#a3e635', '#facc15', '#e5e7eb', '#6366f1', '#06b6d4', '#84cc16', '#f59e42', '#e879f9', '#f43f5e'
  ];

  const chartData = {
    labels: apiResult ? apiResult.map(y => `Year ${y.year}`) : [],
    datasets: [
      {
        label: "Total Net Worth",
        data: apiResult ? apiResult.map(y => y.totalsum) : [],
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.2)",
        tension: 0.1,
        fill: true,
        pointBackgroundColor: "#38bdf8",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 4,
        order: 0,
      },
      // Add a dataset for each investment
      ...(apiResult && apiResult.length > 0 && apiResult[0].investments ?
        apiResult[0].investments
          .map((inv, idx) => {
            const name = inv.elementname;
            // Use a neutral color for Unallocated
            const color = name === 'Unallocated' ? '#e5e7eb' : investmentColors[idx % investmentColors.length];
            return {
              label: name,
              data: apiResult.map(y => {
                const found = y.investments.find(i => i.elementname === name);
                return found ? found.investment_amount : null;
              }),
              borderColor: color,
              backgroundColor: color + '33',
              tension: 0.1,
              fill: false,
              pointBackgroundColor: color,
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 2,
              pointHoverRadius: 4,
              borderWidth: 2,
              order: 1,
            };
          }) : [])
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#495057',
          font: {
            size: 15,
            weight: 'bold',
            family: 'Nunito, Inter, sans-serif'
          },
          boxWidth: 24,
          padding: 20,
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
            const year = context.dataIndex;
            const netWorth = context.parsed.y;
            const yearData = apiResult[year];
            const datasetLabel = context.dataset.label;
            // If this is the Total Net Worth line, show the full breakdown
            if (datasetLabel === 'Total Net Worth') {
              let tooltipText = [`Net Worth: €${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`];
              if (yearData && yearData.investments) {
                tooltipText.push('');
                tooltipText.push('Investment Breakdown:');
                yearData.investments.forEach(inv => {
                  if (inv.elementname !== 'Unallocated') {
                    tooltipText.push(
                      `• ${inv.elementname}: €${inv.investment_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${inv.elementratio}%) — Performance this year: €${inv.return !== undefined ? inv.return.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A'}`
                    );
                  }
                });
                const unallocated = yearData.investments.find(inv => inv.elementname === 'Unallocated');
                if (unallocated && unallocated.investment_amount > 0) {
                  tooltipText.push(
                    `• Unallocated: €${unallocated.investment_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${unallocated.elementratio}%)`
                  );
                }
              }
              return tooltipText;
            } else {
              // For individual investment lines, show only the value and performance
              if (yearData && yearData.investments) {
                const inv = yearData.investments.find(i => i.elementname === datasetLabel);
                if (inv) {
                  return `€${inv.investment_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} — Performance this year: €${inv.return !== undefined ? inv.return.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A'}`;
                }
              }
              return null;
            }
          }
        }
      }
    },
    elements: {
      line: {
        borderWidth: 4,
        borderCapStyle: 'round',
        borderJoinStyle: 'round',
      },
      point: {
        radius: 5,
        hoverRadius: 8,
        backgroundColor: '#38bdf8',
        borderColor: '#fff',
        borderWidth: 2,
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057',
          font: { size: 13, family: 'Nunito, Inter, sans-serif' }
        },
        grid: {
          color: '#e3e8f0',
          lineWidth: 1.2,
        }
      },
      y: {
        ticks: {
          color: '#495057',
          font: { size: 13, family: 'Nunito, Inter, sans-serif' },
          callback: function(value) {
            return '€' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          }
        },
        grid: {
          color: '#e3e8f0',
          lineWidth: 1.2,
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  const hasRequiredData = form.networth && form.income && form.expenses && investments.length > 0;

  return (
    <div className="card h-full flex flex-col">
      <h2>Financial Projections</h2>
      
      {loading && (
        <div className="text-zinc-300 text-center py-2 flex-1 flex items-center justify-center">
          Calculating your financial projections...
        </div>
      )}
      
      {error && (
        <div className="text-red-400 text-center py-1 flex-1 flex items-center justify-center">
          Error: {error}
          <br />
          <small>Make sure your FastAPI backend is running on http://127.0.0.1:8000</small>
        </div>
      )}
      
      {apiResult && apiResult.length > 0 && !loading && !error && (
        <div className="flex-1 min-h-0 px-2 pb-2 pt-4">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
      
      {apiResult && apiResult.length > 0 && (
        <div className="mt-4 p-4 bg-white/80 rounded-xl flex-shrink-0 shadow-sm border border-[#e3e8f0]">
          <h3 className="text-sm font-bold mb-2 text-[#495057]">Summary</h3>
          <div className="grid grid-cols-2 gap-2 text-base">
            <div>
              <span className="text-[#7b8794]">Starting Net Worth:</span>
              <div className="font-bold text-[#22223B] text-lg">€{Number(form.networth).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div>
              <span className="text-[#7b8794]">Projected Net Worth (10 years):</span>
              <div className="font-bold text-green-500 text-lg">
                €{apiResult[apiResult.length - 1]?.totalsum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add a subtle divider below the button */}
      <div className="w-full h-2 mb-2 bg-gradient-to-r from-transparent via-[#e3e8f0] to-transparent rounded-full" />
    </div>
  );
}