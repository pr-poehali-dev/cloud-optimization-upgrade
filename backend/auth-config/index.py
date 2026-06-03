"""
Возвращает публичный Google Client ID для фронтенда
"""
import json
import os


def handler(event: dict, context) -> dict:
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"client_id": os.environ.get("GOOGLE_CLIENT_ID", "")}),
    }
