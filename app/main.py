from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
# from time import sleep
import app.gpt as gpt
import app.sql as sql
import threading

myapp = Flask(__name__)


cors = CORS(myapp, resources={r"/*": {"origins": "*"}})
myapp.config["SESSION_PERMANENT"] = False
myapp.config["SESSION_TYPE"] = "filesystem"
sql.create_table()


@myapp.route('/start/', methods=['POST'])
@cross_origin()
def start():
    topic = request.get_json()['topic']
    question, fake, real = gpt.starter_prompt(topic)
    session_id = sql.insert_table(question, fake, real)
    return jsonify({"id": session_id})


@myapp.route('/next/', methods=['POST'])
@cross_origin()
def next_message():
    last_message = request.get_json()['last_message']
    session_id = request.get_json()['id']
    type = request.get_json()['type']
    person = request.get_json()['person']

    session = sql.load(session_id)
    fake, real, so_far = session[2:]

    threads = []
    outputs = dict()

    if last_message != "":
        threads.append(threading.Thread(target=_next_helper1, args=(last_message, person, outputs)))
    threads.append(threading.Thread(target=_next_helper2, args=(last_message, type, fake, real, so_far, person, outputs)))

    for thread in threads:
        thread.start()

    for thread in threads:
        thread.join()

    if last_message != "":
        sql.update_table(session_id, outputs["summary"])
    return jsonify({"response": outputs["response"]})


def _next_helper1(last_message: str, person: int, outputs: dict):
    summary = gpt.summarize(last_message, person)
    outputs["summary"] = summary


def _next_helper2(last_message: str, type: str, fake: str, real: str, so_far: str, person: int, outputs: dict):
    response = ""
    if type == "real":
        response = gpt.generate_real(last_message, so_far, fake, real, person)
    elif type == "fake":
        response = gpt.generate_fake(last_message, so_far, fake, real, person)
    elif type == "real_start":
        response = gpt.start_real(last_message, so_far, fake, real, person)
    elif type == "fake_start":
        response = gpt.start_fake(last_message, so_far, fake, real, person)
    elif type == "real_end":
        response = gpt.conclude_real(last_message, so_far, fake, real, person)
    elif type == "fake_end":
        response = gpt.conclude_fake(last_message, so_far, fake, real, person)

    outputs["response"] = response


@myapp.route('/answer/', methods=['POST'])
@cross_origin()
def answer_prompt():
    session_id = request.get_json()['id']
    answer = request.get_json()['answer']
    real_person = request.get_json()['real_person']

    session = sql.load(session_id)
    fake, real, so_far = session[2:]

    return jsonify({"response": gpt.answer(answer, fake, real, so_far, real_person)})
