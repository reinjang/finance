from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict
import ast
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
    data: str  # Expecting a string representation of a dictionary

@app.post("/multiply_dict/")
def multiply_dict(input_data: DictInput):
    try:
        # Safely evaluate the string to a dictionary
        input_dict = ast.literal_eval(input_data.data)
        if not isinstance(input_dict, dict):
            raise ValueError
        # Multiply each value by 2 and return with key 'multiplied'
        # Only use the first value in the dictionary
        if len(input_dict) != 1:
            raise ValueError
        value = next(iter(input_dict.values()))
        multiplied = value * 2
        return {"multiplied": multiplied}
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid dictionary string.") 