from typing import Dict, Any, List
import configparser
import requests
import json
from datetime import datetime


class Notion:
    def __init__(self) -> None:
        config = configparser.ConfigParser()
        config.read("config.ini")

        self.notion_key = config["NOTION"]["key"]
        self.notion_database_id = config["NOTION"]["database_id"]

    def get_page_by_title(self, page_title: str) -> Dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {self.notion_key}",
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28",
        }
        request_body = {
            "filter": {"property": "Title", "title": {"equals": page_title}}
        }

        response = requests.post(
            f"https://api.notion.com/v1/databases/{self.notion_database_id}/query/",
            headers=headers,
            json=request_body,
        )

        results = json.loads(response.text)["results"]
        if len(results):
            return results[0]
        return None

    def add_page_notes(self, paper: Dict[str, Any], notes: Dict[str, List]):
        headers = {
            "Authorization": f"Bearer {self.notion_key}",
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28",
        }

        request_body = {
            "children": [
                {
                    "object": "block",
                    "type": "heading_2",
                    "heading_2": {
                        "rich_text": [
                            {
                                "type": "text",
                                "text": {"content": "Notes from the document"},
                                "annotations": {},
                            }
                        ]
                    },
                },
                {
                    "object": "block",
                    "type": "paragraph",
                    "paragraph": {
                        "rich_text": [
                            {
                                "type": "mention",
                                "mention": {
                                    "type": "date",
                                    "date": {"start": str(datetime.now())},
                                },
                            }
                        ]
                    },
                },
            ]
        }

        for page_number in notes:
            page_content = {
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [
                        {
                            "type": "text",
                            "text": {"content": f"page {page_number}"},
                            "annotations": {"code": True},
                        },
                    ]
                },
            }
            request_body["children"].append(page_content)

            for note in notes[page_number]:
                note_content = {
                    "object": "block",
                    "type": "paragraph",
                    "paragraph": {
                        "rich_text": [
                            {
                                "type": "text",
                                "text": {
                                    "content": note["content"],
                                },
                                "annotations": {"color": note["color"]}
                            },
                        ]
                    },
                }

                request_body["children"].append(note_content)

        response = requests.patch(
            f"https://api.notion.com/v1/blocks/{paper['id']}/children",
            headers=headers,
            json=request_body,
        )

        if response.status_code == 200:
            return True
        return False
