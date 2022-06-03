'''
NM Water and Climate App
'''

from fastapi import FastAPI
from starlette.templating import Jinja2Templates
from starlette.staticfiles import StaticFiles
from starlette.requests import Request


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
    return {'test'}