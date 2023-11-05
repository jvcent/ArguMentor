from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import app.gpt as gpt
import app.sql as sql
import threading

app = Flask(__name__)


cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"


@app.route('/', methods=['GET'])
@cross_origin()
def index():
    return "hello"


@app.route('/start/', methods=['GET', 'POST'])
@cross_origin()
def start():
    sql.create_table()
    topic = request.get_json()['topic']
    question, fake, real = gpt.starter_prompt(topic)
    session_id = sql.insert_table(question, fake, real)
    return jsonify({"id": session_id})


@app.route('/next/', methods=['GET', 'POST'])
@cross_origin()
def next_message():
    session_id = 1

    session = sql.load(session_id)
    fake, real, so_far, real_person, first_person, round, stop, last_message = session[2:]

    if round <= stop:
        threads = []
        outputs = dict()

        person = (round + first_person) % 2
        sql.update_table_round(session_id)

        if person == real_person:
            type = 'real'
        else:
            type = 'fake'

        if round == 0 or round == 1:
            type += '_start'
        elif round == stop or round == stop - 1:
            type += '_end'

        if last_message != "":
            threads.append(threading.Thread(target=_next_helper1, args=(last_message, person, outputs)))
        threads.append(threading.Thread(target=_next_helper2, args=(last_message, type, fake, real, so_far, person, outputs)))

        for thread in threads:
            thread.start()

        for thread in threads:
            thread.join()

        if last_message != "":
            sql.update_table_so_far(session_id, outputs["summary"])

        sql.update_table_last(session_id, outputs["response"])
        return jsonify({"response": outputs["response"]})
    else:
        return jsonify({"response": "STOP"})


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


@app.route('/answer/', methods=['POST'])
@cross_origin()
def answer_prompt():
    session_id = 1
    answer = request.get_json()['answer']

    session = sql.load(session_id)
    fake, real, so_far, real_person = session[2:6]
    sql.remove_table()

    return jsonify({"response": gpt.answer(answer, fake, real, so_far, real_person)})
