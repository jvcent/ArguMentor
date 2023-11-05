import sqlite3
from random import randint


def create_table():
    with sqlite3.connect('database.db', check_same_thread=False) as conn:
        cursor = conn.cursor()
        command = f"CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, question nvarchar(100), fake nvarchar(100), real nvarchar(100), so_far nvarchar(100), real_person TINYINT, first_person TINY_INT, round INT, stop INT, last_message nvarchar(100))"
        cursor.execute(command)
        conn.commit()


def insert_table(question: str, fake: str, real: str) -> int:
    with sqlite3.connect('database.db', check_same_thread=False) as conn:
        cursor = conn.cursor()
        command = f"INSERT INTO sessions (question, fake, real, so_far, real_person, first_person, round, stop, last_message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        cursor.execute(command, (question, fake, real, '', randint(0, 1), 0, 0, randint(4, 6) * 2, ""))
        conn.commit()
        return cursor.lastrowid


def update_table_so_far(id: int, addition: str):
    with sqlite3.connect('database.db', check_same_thread=False) as conn:
        cursor = conn.cursor()

        cursor.execute(f'SELECT so_far FROM sessions WHERE id = "{id}"')
        so_far = cursor.fetchone()[0]
        new_so_far = so_far + addition + " \n"
        command = f'UPDATE sessions SET so_far = ? WHERE id = "{id}"'
        cursor.execute(command, (new_so_far,))
        conn.commit()


def update_table_last(id: int, addition: str):
    with sqlite3.connect('database.db', check_same_thread=False) as conn:
        cursor = conn.cursor()

        command = f'UPDATE sessions SET last_message = ? WHERE id = "{id}"'
        cursor.execute(command, (addition,))
        conn.commit()


def update_table_round(id: int):
    with sqlite3.connect('database.db', check_same_thread=False) as conn:
        cursor = conn.cursor()
        cursor.execute(f'SELECT round FROM sessions WHERE id = "{id}"')
        round = cursor.fetchone()[0]
        command = f'UPDATE sessions SET round = ? WHERE id = "{id}"'
        cursor.execute(command, (round + 1,))
        conn.commit()


def remove_table():
    with sqlite3.connect('database.db', check_same_thread=False) as conn:
        cursor = conn.cursor()
        command = f"DROP TABLE IF EXISTS sessions"
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
