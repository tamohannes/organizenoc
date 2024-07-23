import configparser
import json
from datetime import datetime
from typing import Any, Dict, List

import requests


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
        request_body = {"filter": {"property": "Title", "title": {"equals": page_title}}}

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
                    "type": "heading_3",
                    "heading_3": {
                        "rich_text": [
                            {
                                "type": "text",
                                "text": {"content": "Notes on "},
                                "annotations": {},
                            },
                            {
                                "type": "mention",
                                "mention": {
                                    "type": "date",
                                    "date": {"start": str(datetime.now())},
                                },
                            },
                        ],
                        "children": [],
                        "is_toggleable": True,
                    },
                },
            ],
        }

        for i, page_number in enumerate(notes):
            page_content = {
                "object": "block",
                "type": "toggle",
                "toggle": {
                    "rich_text": [
                        {
                            "type": "text",
                            "text": {"content": f"page {page_number}"},
                            "annotations": {"bold": True},
                        }
                    ],
                    "children": [],
                },
            }
            request_body["children"][0]["heading_3"]["children"].append(page_content)

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
                                "annotations": {"color": note["color"]},
                            },
                        ]
                    },
                }
                request_body["children"][0]["heading_3"]["children"][i]["toggle"]["children"].append(note_content)

        response = requests.patch(
            f"https://api.notion.com/v1/blocks/{paper['id']}/children",
            headers=headers,
            json=request_body,
        )

        if response.status_code == 200:
            return True
        return False

    def add_page_findings(self, paper: Dict[str, Any], findings: str, prompt: str):
        print("trying to add")
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
                                "text": {"content": "Ask AI"},
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
                                "type": "text",
                                "text": {
                                    "content": prompt,
                                },
                            }
                        ]
                    },
                },
                {
                    "type": "toggle",
                    "toggle": {
                        "rich_text": [
                            {
                                "type": "mention",
                                "mention": {
                                    "type": "date",
                                    "date": {"start": str(datetime.now())},
                                },
                            }
                        ],
                        "children": [
                            {
                                "type": "paragraph",
                                "paragraph": {
                                    "rich_text": [
                                        {
                                            "type": "text",
                                            "text": {
                                                "content": findings,
                                            },
                                            "annotations": {"bold": True},
                                        },
                                    ]
                                },
                            },
                        ],
                    },
                },
            ]
        }

        response = requests.patch(
            f"https://api.notion.com/v1/blocks/{paper['id']}/children",
            headers=headers,
            json=request_body,
        )

        if response.status_code == 200:
            return True
        return False
