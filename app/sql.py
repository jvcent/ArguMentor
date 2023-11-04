import sqlite3


def create_table():
    with sqlite3.connect('database.db', check_same_thread=False) as conn:
        cursor = conn.cursor()
        command = f"CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, question nvarchar(100), fake nvarchar(100), real nvarchar(100), so_far nvarchar(100))"
        cursor.execute(command)
        conn.commit()


def insert_table(question: str, fake: str, real: str) -> int:
    with sqlite3.connect('database.db', check_same_thread=False) as conn:
        cursor = conn.cursor()
        command = f"INSERT INTO sessions (question, fake, real, so_far) VALUES (?, ?, ?, ?)"
        cursor.execute(command, (question, fake, real, ''))
        conn.commit()
        return cursor.lastrowid


def update_table(id: int, addition: str):
    with sqlite3.connect('database.db', check_same_thread=False) as conn:
        cursor = conn.cursor()

        cursor.execute(f'SELECT so_far FROM sessions WHERE id = "{id}"')
        so_far = cursor.fetchone()[0]
        new_so_far = so_far + addition + " \n"
        command = f'UPDATE sessions SET so_far = ? WHERE id = "{id}"'
        cursor.execute(command, (new_so_far,))
        conn.commit()


def remove_row(id: int):
    with sqlite3.connect('database.db', check_same_thread=False) as conn:
        cursor = conn.cursor()
        command = f"DELETE FROM sessions WHERE id = {id}"
        cursor.execute(command)
        conn.commit()


def load(id: int):
    with sqlite3.connect('database.db', check_same_thread=False) as conn:
        cursor = conn.cursor()
        command = f"SELECT * FROM sessions WHERE id = '{id}'"
        cursor.execute(command)

        return cursor.fetchone()


def load_all():
    with sqlite3.connect('database.db', check_same_thread=False) as conn:
        cursor = conn.cursor()
        command = f"SELECT * FROM sessions"
        cursor.execute(command)

        for x in cursor.fetchall():
            print(x)
