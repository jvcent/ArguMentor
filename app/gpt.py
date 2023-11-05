import openai
from time import sleep
from app.api import API_KEY
# from pprint import pprint
import os

#####################################################
# GLOBAL VARIABLES

openai.api_key = API_KEY
MODEL = "gpt-4"
TOKENS = 1000
NAMES = ['Archibald', 'Horatio']
RESPONSE_WORDS = 100
BULLET_WORDS = 15

#####################################################


def character(person: int) -> str:
    name = NAMES[person]

    if person == 0:
        return f"As {name}, respond in a sarcastic way as if you believe you are always right"
    else:
        return f"As {name}, respond in an overly optimistic way as if you believe that you will surely be able to convince the other if you try hard enough"


def prompt_openai(prompt: str | list, history: bool = False, n: int = 1) -> dict:
    if history:
        messages = prompt
    else:
        messages = [{"role": "user", "content": prompt}]


    # print(messages)

    return openai.ChatCompletion.create(
        model=MODEL,
        messages=messages,
        max_tokens=TOKENS,
        n=n
    )


def _prompt_failsafe(prompt: str | list, history: bool = False, n: int = 1) -> dict:
    try:
        return prompt_openai(prompt, history, n)
    except openai.error.RateLimitError:
        sleep(3)
        print(f"Retrying prompt: '{prompt}'")
        return _prompt_failsafe(prompt, history, n)


def read_openai(response: dict) -> tuple[list, int]:
    output = [choice["message"]["content"] for choice in response["choices"]]
    usage = response["usage"]

    return output, usage["total_tokens"]


def text_to_messages(text_lines: list, start_opponent: bool = False) -> list[dict[str, str]]:
    messages = [{"role": "system", "content": text_lines[0]}]

    for i, text_line in enumerate(text_lines[1:]):
        if i % 2 == int(start_opponent):
            messages.append({"role": "user", "content": text_line})
        else:
            messages.append({"role": "opponent", "content": text_line})

    return messages


def starter_prompt(topic: str):
    prompt = f"""We are trying to test whether someone is able to identify misinformation through their knowledge and logical reasoning
Given the topic below, create an answerable debate question based on established fact within this topic and provide both a subtle false answer and a real answer
Here is the topic: {topic}"""

    response = _prompt_failsafe(prompt)
    result_text = read_openai(response)[0][0]
    texts = result_text.split("\n")

    texts = [text for text in texts if text.strip() != ""]

    question = texts[0].strip()
    fake = texts[1].strip()
    real = texts[2].strip()

    return question, fake, real


def summarize(text: str, person: int):
    name = NAMES[person]
    header = f"{name}'s response:\n"

    prompt = f"""The speaker's name is {name}. Summarize the argument of the provided text using three concise bullet points with less than {BULLET_WORDS} words per point. Be succinct and factual. {text}"""
    response = _prompt_failsafe(prompt)
    result_text = read_openai(response)[0][0]

    return header + result_text


def start_real(previous: str, so_far: str, fake: str, real: str, person: int):
    name = NAMES[person]
    other = NAMES[(person + 1) % 2]

    system_prompt = f"""Your name is {name} and you are currently debating with {other} in a debate.
Your position in the debate is: {real}. 
However, you are also conspiring with {other} to test any observer if they can identify the misinformation so you are not to make it obvious what you or {other} is trying to do.
"""

    system_prompt += " \n" + character(person)

    prompt = f"""The debate has just started so give an introductory statement to your argument.
Again, you are arguing that {real} but you are not to make it obvious that {other}'s argument is false, instead focus on why your argument is correct.
Limit your response to be concise and less than {RESPONSE_WORDS} words."""

    if previous != "":
        prompt += f" \nHere is {other}'s response for you to address if needed: {previous}"

    messages = [system_prompt, prompt]
    formatted_messages = text_to_messages(messages)

    response = _prompt_failsafe(formatted_messages, True)
    result_text = read_openai(response)[0][0]

    return result_text


def start_fake(previous: str, so_far: str, fake: str, real: str, person: int):
    name = NAMES[person]
    other = NAMES[(person + 1) % 2]

    system_prompt = f"""Your name is {name} and you are currently debating with {other} in a debate.
Your position in the debate is: {fake}. 
However, you are also conspiring with {other} to test any observer if they can identify the misinformation so you are not to make it obvious what you or {other} is trying to do."""

    system_prompt += " \n" + character(person)

    prompt = f"""The debate has just started so give an introductory statement to your argument.
Again, you are arguing that {fake} but you are to make your answer convincing and not to make it obvious that {other}'s argument is correct or make it obvious that your argument is widely considered false, instead focus on why your argument is correct.
Limit your response to be concise and less than {RESPONSE_WORDS} words."""

    if previous != "":
        prompt += f" \nHere is {other}'s response for you to address if needed: {previous}"

    messages = [system_prompt, prompt]
    formatted_messages = text_to_messages(messages)

    response = _prompt_failsafe(formatted_messages, True)
    result_text = read_openai(response)[0][0]

    return result_text


def generate_real(previous: str, so_far: str, fake: str, real: str, person: int):
    name = NAMES[person]
    other = NAMES[(person + 1) % 2]

    system_prompt = f"""Your name is {name} and you are currently debating with {other} in a debate.
Your position in the debate is: {real} whereas {other} is arguing the false answer: {fake}. 
However, you are also conspiring with {other} to test any observer if they can identify the misinformation so you are not to make it obvious what you or {other} is trying to do.
Here is the summary of the debate thusfar:
{so_far}"""

    system_prompt += " \n" + character(person)

    prompt = f"""Expand your argument based on the debate points thusfar, use examples or evidence, and respond to {other}'s argument if provided.
Again, you are arguing that {real} but you are not to make it too obvious that {other}'s argument is false, instead focus on why your argument is correct.
Limit your response to be concise and less than {RESPONSE_WORDS} words."""

    if previous != "":
        prompt += f" \nHere is {other}'s response: {previous}"

    messages = [system_prompt, prompt]
    formatted_messages = text_to_messages(messages)

    response = _prompt_failsafe(formatted_messages, True)
    result_text = read_openai(response)[0][0]

    return result_text


def generate_fake(previous: str, so_far: str, fake: str, real: str, person: int):
    name = NAMES[person]
    other = NAMES[(person + 1) % 2]

    system_prompt = f"""Your name is {name} and you are currently debating with {other} in a debate.
Your position in the debate is: {fake} whereas {other} is arguing the real answer: {real}. 
However, you are also conspiring with {other} to test any observer if they can identify the misinformation so you are not to make it obvious what you or {other} is trying to do.
Here is the summary of the debate thusfar:
{so_far}"""

    system_prompt += " \n" + character(person)

    prompt = f"""Expand your argument based on the debate points thusfar, use examples or evidence, and respond to {other}'s argument if provided.
Again, you are arguing that {fake} but you are to make your answer convincing and not to make it obvious that {other}'s argument is correct or make it obvious that your argument is widely considered false, instead focus on why your argument is correct.
Limit your response to be concise and less than {RESPONSE_WORDS} words."""

    if previous != "":
        prompt += f" \nHere is {other}'s response: {previous}"

    messages = [system_prompt, prompt]
    formatted_messages = text_to_messages(messages)

    response = _prompt_failsafe(formatted_messages, True)
    result_text = read_openai(response)[0][0]

    return result_text


def conclude_real(previous: str, so_far: str, fake: str, real: str, person: int):
    name = NAMES[person]
    other = NAMES[(person + 1) % 2]

    system_prompt = f"""Your name is {name} and you are currently debating with {other} in a debate.
Your position in the debate is: {real} whereas {other} is arguing the false answer: {fake}. 
However, you are also conspiring with {other} to test any observer if they can identify the misinformation so you are not to make it obvious what you or {other} is trying to do.
Here is the summary of the debate thusfar:
    {so_far}"""

    system_prompt += " \n" + character(person)

    prompt = f"""Make a concluding statement for your argument based on the debate points thusfar.
Again, you are arguing that {real} but you are not to make it too obvious that {other}'s argument is false, instead focus on why your argument is correct.
Limit your response to be concise and less than {RESPONSE_WORDS} words."""

    if previous != "":
        prompt += f" \nHere is {other}'s response: {previous}"

    messages = [system_prompt, prompt]
    formatted_messages = text_to_messages(messages)

    response = _prompt_failsafe(formatted_messages, True)
    result_text = read_openai(response)[0][0]

    return result_text


def conclude_fake(previous: str, so_far: str, fake: str, real: str, person: int):
    name = NAMES[person]
    other = NAMES[(person + 1) % 2]

    system_prompt = f"""Your name is {name} and you are currently debating with {other} in a debate.
Your position in the debate is: {fake} whereas {other} is arguing the real answer: {real}. 
However, you are also conspiring with {other} to test any observer if they can identify the misinformation so you are not to make it obvious what you or {other} is trying to do.
Here is the summary of the debate thusfar:
    {so_far}"""

    system_prompt += " \n" + character(person)

    prompt = f"""Make a concluding statement for your argument based on the debate points thusfar.
Again, you are arguing that {fake} but you are to make your answer convincing and not to make it obvious that {other}'s argument is correct or make it obvious that your argument is widely considered false, instead focus on why your argument is correct.
Limit your response to be concise and less than {RESPONSE_WORDS} words."""

    if previous != "":
        prompt += f" \nHere is {other}'s response: {previous}"

    messages = [system_prompt, prompt]
    formatted_messages = text_to_messages(messages)

    response = _prompt_failsafe(formatted_messages, True)
    result_text = read_openai(response)[0][0]

    return result_text


def answer(answer: str, fake: str, real: str, so_far: str, real_person: int):
    name = NAMES[real_person]
    other = NAMES[(real_person + 1) % 2]

    prompt = f"""You are helping to test whether someone is able to spot misinformation in a debate where one side is purposely arguing a wrong answer.
Here are the two positions in the debate: {name} is arguing {real} and {other} is arguing {fake}
Firstly, confirm that the supposed correct answer is indeed correct, or use an actual correct answer instead
Next, read the provided debate summary and then read the answer of the observer on who is describing misinformation in the debate.
Congratulate the observer if they are correct and explain why the observer is wrong if they are incorrect.

Refer to the observer in second person in your response.

Here is the observer's answer: {answer}"""
    response = _prompt_failsafe(prompt)
    result_text = read_openai(response)[0][0]

    return result_text
