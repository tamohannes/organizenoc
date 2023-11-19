import os
from pathlib import Path
from typing import Any, Dict, List

import wget
from document import Document
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from findings import Finder
from notion import Notion
from pydantic import BaseModel

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
        file_path = Path(item.file_dir).joinpath(
            item.file_name + Path(item.pdf_link).suffix
        )

        if not file_path.is_file():
            wget.download(url=item.pdf_link, out=str(file_path))
        return JSONResponse(content={"status": True})
    except:
        return JSONResponse(content={"status": False})


class ItemFindings(BaseModel):
    paper_title: str
    prompt: str


@app.post("/get_findings")
def get_findings(item: ItemFindings):
    try:
        finder = Finder()
        findings = finder.get_findings(item)

        notion = Notion()
        paper: Dict[str, Any] = notion.get_page_by_title(item.paper_title)

        if paper:
            added = notion.add_page_findings(paper, findings, finder.prompt)
            if added:
                return JSONResponse(content={"status": True})
            else:
                JSONResponse(content={"status": False})
    except:
        return JSONResponse(content={"status": False})
