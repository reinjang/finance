from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict
import ast

app = FastAPI()

class DictInput(BaseModel):
    data: str  # Expecting a string representation of a dictionary

@app.post("/multiply_dict/")
def multiply_dict(input_data: DictInput):
    try:
        # Safely evaluate the string to a dictionary
        input_dict = ast.literal_eval(input_data.data)
        if not isinstance(input_dict, dict):
            raise ValueError
        # Multiply each value by 2
        result = {k: v * 2 for k, v in input_dict.items()}
        return {"result": result}
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid dictionary string.") 