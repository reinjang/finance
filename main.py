from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DictInput(BaseModel):
    data: Dict[str, int]  # Accept a dictionary directly

@app.post("/multiply_dict/")
def multiply_dict(input_data: DictInput):
    try:
        input_dict = input_data.data
        # Validate keys
        expected_keys = {"start", "income", "expenses"}
        if set(input_dict.keys()) != expected_keys:
            raise ValueError("Input must contain exactly 'start', 'income', and 'expenses'.")
        start = input_dict["start"]
        income = input_dict["income"]
        expenses = input_dict["expenses"]
        net = income - expenses
        result = {}
        result["year_1"] = start
        for i in range(2, 11):
            result[f"year_{i}"] = result[f"year_{i-1}"] + net * 12
        return {"result": result}
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid input. Must be a dict with 'start', 'income', and 'expenses'.") 