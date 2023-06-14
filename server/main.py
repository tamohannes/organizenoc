from typing import List, Dict, Any
from document import Document
from notion import Notion
import os
import wget
from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ItemNote(BaseModel):
    document_path: Path
    page_title: str


@app.post("/add_note")
def add_not(item: ItemNote):
    document = Document()
    notes: Dict[str, List] = document.get_notes(item.document_path)

    notion = Notion()
    paper: Dict[str, Any] = notion.get_page_by_title(item.page_title)

    if paper:
        added = notion.add_page_notes(paper, notes)
        if added:
            return JSONResponse(content={"status": True})
    return JSONResponse(content={"status": False})


class ItemPaper(BaseModel):
    file_dir: Path
    file_name: str
    pdf_link: str


@app.post("/save_paper")
def save_paper(item: ItemPaper):
    try:
        os.makedirs(item.file_dir, exist_ok=True)
        file_path = Path(item.file_dir).joinpath(item.file_name + Path(item.pdf_link).suffix)
        
        if not file_path.is_file():
            wget.download(url=item.pdf_link, out=str(file_path))
        return JSONResponse(content={"status": True})
    except:
        return JSONResponse(content={"status": False})
