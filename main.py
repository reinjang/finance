from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PieSlice(BaseModel):
    name: str
    percent: float
    performance: float

class Investment(BaseModel):
    elementname: str
    elementratio: float
    elementperformance: float

class FinanceInput(BaseModel):
    networth: float
    income: float
    expenses: float
    investments: List[Investment]

@app.post("/api")
def api(input_data: FinanceInput):
    try:
        networth = input_data.networth
        income = input_data.income
        expenses = input_data.expenses
        investments = input_data.investments
        years = 10
        results = []
        current_networth = networth
        for year in range(0, years + 1):
            year_result = {"year": int(year)}
            investment_returns = []
            total_investment_return = 0.0
            total_ratio = sum(float(inv.elementratio) for inv in investments)
            for inv in investments:
                inv_return = float(current_networth) * (float(inv.elementratio) / 100.0) * (float(inv.elementperformance) / 100.0)
                investment_amount = float(current_networth) * (float(inv.elementratio) / 100.0)
                investment_returns.append({
                    "elementname": str(inv.elementname),
                    "elementratio": float(inv.elementratio),
                    "elementperformance": float(inv.elementperformance),
                    "return": inv_return,
                    "investment_amount": investment_amount
                })
                total_investment_return += inv_return
            # Add unallocated if not 100%
            if total_ratio < 100:
                unallocated_ratio = 100 - total_ratio
                unallocated_amount = float(current_networth) * (unallocated_ratio / 100.0)
                investment_returns.append({
                    "elementname": "Unallocated",
                    "elementratio": unallocated_ratio,
                    "elementperformance": 0.0,
                    "return": 0.0,
                    "investment_amount": int(unallocated_amount)
                })
            year_result["totalsum"] = int(current_networth)
            year_result["investments"] = investment_returns
            results.append(year_result)
            # Calculate networth for next year (income and expenses are yearly)
            current_networth = float(current_networth) + (float(income) * 12 - float(expenses) * 12) + float(total_investment_return)
        return {"result": results}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid input. {str(e)}") 