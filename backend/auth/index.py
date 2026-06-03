"""
Аутентификация через Google OAuth: верификация токена, создание/получение пользователя, сохранение никнейма
"""
import json
import os
import urllib.request
import urllib.parse
import psycopg2


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def verify_google_token(token: str) -> dict:
    url = f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read())
    if data.get("aud") != os.environ["GOOGLE_CLIENT_ID"]:
        raise ValueError("Invalid token audience")
    return data


def handler(event: dict, context) -> dict:
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token, X-Session-Id",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    path = event.get("path", "/")
    method = event.get("httpMethod", "GET")

    # POST /auth/google - верификация Google токена
    if path.endswith("/google") and method == "POST":
        body = json.loads(event.get("body") or "{}")
        token = body.get("token")
        if not token:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Token required"})}

        google_data = verify_google_token(token)
        google_id = google_data["sub"]
        email = google_data.get("email", "")
        name = google_data.get("name", "")
        avatar = google_data.get("picture", "")

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO t_p97001973_cloud_optimization_u.users (google_id, email, name, avatar)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (google_id) DO UPDATE SET name = EXCLUDED.name, avatar = EXCLUDED.avatar, updated_at = NOW()
            RETURNING id, google_id, email, name, avatar, nickname
            """,
            (google_id, email, name, avatar),
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        user = {"id": row[0], "google_id": row[1], "email": row[2], "name": row[3], "avatar": row[4], "nickname": row[5]}
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"user": user})}

    # PUT /auth/nickname - сохранение никнейма
    if path.endswith("/nickname") and method == "PUT":
        body = json.loads(event.get("body") or "{}")
        user_id = body.get("user_id")
        nickname = body.get("nickname", "").strip()

        if not user_id or not nickname:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "user_id and nickname required"})}

        if len(nickname) < 3 or len(nickname) > 20:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Ник должен быть от 3 до 20 символов"})}

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "SELECT id FROM t_p97001973_cloud_optimization_u.users WHERE nickname = %s AND id != %s",
            (nickname, user_id),
        )
        if cur.fetchone():
            cur.close()
            conn.close()
            return {"statusCode": 409, "headers": headers, "body": json.dumps({"error": "Этот ник уже занят"})}

        cur.execute(
            "UPDATE t_p97001973_cloud_optimization_u.users SET nickname = %s, updated_at = NOW() WHERE id = %s RETURNING id, email, name, avatar, nickname",
            (nickname, user_id),
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        user = {"id": row[0], "email": row[1], "name": row[2], "avatar": row[3], "nickname": row[4]}
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"user": user})}

    # GET /auth/me?user_id=X
    if path.endswith("/me") and method == "GET":
        user_id = (event.get("queryStringParameters") or {}).get("user_id")
        if not user_id:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "user_id required"})}

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "SELECT id, email, name, avatar, nickname FROM t_p97001973_cloud_optimization_u.users WHERE id = %s",
            (user_id,),
        )
        row = cur.fetchone()
        cur.close()
        conn.close()

        if not row:
            return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "User not found"})}

        user = {"id": row[0], "email": row[1], "name": row[2], "avatar": row[3], "nickname": row[4]}
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"user": user})}

    return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "Not found"})}
