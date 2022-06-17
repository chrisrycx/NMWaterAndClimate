'''
NM Water and Climate App
'''

from fastapi import FastAPI
from starlette.templating import Jinja2Templates
from starlette.staticfiles import StaticFiles
from starlette.requests import Request
from pydantic import BaseModel
from typing import List
from datetime import date

class envdata(BaseModel):
    dtstamps: List[date] = []
    values: List[float] = []

app=FastAPI()
templates = Jinja2Templates(directory='templates')
app.mount('/static',StaticFiles(directory='static'),name='static') #Only needed running locally?

@app.get('/NMWaterApp/')
async def root(request:Request):
    return templates.TemplateResponse(
        'NMWaterApp.html',
        {
            'request':request,
        }
    )

@app.get('/NMWaterApp/precipitation')
async def getprecip():
    # Generate some dummy data
    response = envdata()
    response.dtstamps = [date(2022,5,6),date(2022,6,6),date(2022,7,7)]
    response.values = [22,34.6,101.44]

    return response