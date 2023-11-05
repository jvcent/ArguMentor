import "./Chat.css"
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { useCallback } from "react";
import { Popup } from "./Popup";
import { useSpeechSynthesis } from 'react-speech-kit';
import Lottie from "lottie-react";
import boss from "./assets/boss.json";
import nerd from "./assets/nerd.json";
import "./Input.css"

export const Chat = () => {
    // const location = useLocation();
    // const { data } = location.state || {}; 

    // Now you can use pdfText and userInput

    // console.log("data:", data);
    const navigate = useNavigate();

    const [active, setActive] = useState();
    const [userAnswer, setUserAnswer] = useState('');

    const handleUserMessage = (e) => {
        e.preventDefault();
        setUserAnswer(e.target.value);
      };

    const handleButtonClick = () => {
        const combinedAnswer = active === 1 ? "Archibald was wrong. " + userAnswer : "Horatio was wrong. " + userAnswer;
        navigate("/popup", {state: {combinedAnswer}})
    }

    const [chatMessages, setChatMessages] = useState([]);

    const [isFetching, setIsFetching] = useState(false);

    const { speak, speaking, supported } = useSpeechSynthesis();

    const fetchChatMessages = useCallback(async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/next/");
            if (response.ok) {
                const data = await response.json();
                const responseText = data.response
                if (responseText === "STOP") {return;}
                setChatMessages((prevMessages) => [...prevMessages, responseText]);
            } 
            else {
                console.error('Failed to fetch chat messages')
            }
        } catch (error) {
            console.error("Next API Call Error:", error);
        } finally {
            setIsFetching(false); // Indicate that the API call is finished
          }

    }, []);

    useEffect(() => {
        if (supported) {
            if (!speaking) {
              speak({ text: chatMessages[chatMessages.length - 1] , rate: 2.5});
              console.log(chatMessages.length);
              console.log(speaking);
            }
        }
      }, [chatMessages]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            // Only fetch messages if not currently fetching or speaking
            if (!isFetching) {
              fetchChatMessages();
            }
          }, 5000);
          return () => clearInterval(intervalId);
        }, [isFetching, fetchChatMessages]);

    // useEffect(() => {

    // })

    // useEffect(() => {
    //     const dataToSend = data;
    //     callFirstAPI(dataToSend)
    //         .then((response) => {
    //             if (response) {
    //                 callSecondAPI().then((nextReponse) => {
    //                     if (nextReponse) {
    //                         setChatMessages((prev) => [...prev, response, nextReponse]);
    //                     }
    //                 })
    //             }
    //         })
    // }, [data])

    return (
        <div className="text-white h-screen w-screen flex flex-row items-center justify-center bg-blue-800 p-12 ">
            <div className="h-full w-3/5 bg-blue-900 rounded-l-[50px] flex flex-row justify-center" id="everything">
                <div className="flex flex-col justify-end mb-6 ml-12 text-xl font-semibold">
                <Lottie
                    animationData={nerd}
                    className="w-48 mb-8"
                />
                <span>ARCHIBALD</span>
                </div>
                <ScrollToBottom className="font-semibold flex flex-col h-5/6 w-5/6 justify-center items-center overflow-auto mt-3 p-3">
                    {chatMessages.map((message, index) => (
                        (index % 2 === 0 ? 
                            <div
                            className="text-white text-left whitespace-normal bg-sky-500 flex flex-row justify-start h-auto mt-4 p-4 mr-10 rounded-t-2xl rounded-br-2xl"
                            key={index}
                            >
                            {message}
                            </div>

                        :
                            <div
                            className="text-white text-left whitespace-normal bg-orange-400 flex flex-row-reverse justify-start h-auto mt-4 p-4 ml-10 rounded-t-2xl rounded-bl-2xl"
                            key={index}
                            >
                            {message}
                            </div>
                        )
                    ))}
                </ScrollToBottom>
                <div className="flex flex-col justify-end mb-6 mr-10 text-xl font-semibold">
                    <Lottie
                        animationData={boss}
                        className="w-36"
                    />
                    <span>HORATIO</span>
                </div>
            </div>

            <div className="h-full w-2/5 bg-indigo-900 rounded-r-[50px] flex flex-col items-center" id="everything">
                <h1 className="text-2xl mt-16 font-semibold">Who was wrong?</h1>
                <div className="flex flex-row space-x-4 justify-center w-full">
                    <button onClick={() => setActive(1)} 
                    className={`text-xl py-3 mt-4 px-5 w-1/4 rounded-lg ${active === 1 ? "bg-sky-400" : "bg-sky-600"}`}>
                        Archibald</button>
                    <button onClick={() => setActive(2)} 
                    className={`text-xl py-2 mt-4 px-4 w-1/4 rounded-lg ${active === 2 ? "bg-sky-400" : "bg-sky-600"}`}>
                        Horatio</button>
                </div>

                <h1 className="text-2xl mt-12 font-semibold">Justify your answer</h1>
                <textarea onChange={handleUserMessage} className="justify-box text-lg h-1/2 w-5/6 p-4 bg-indigo-950 mx-6 mt-4 whitespace-normal " placeholder="Enter explanation"></textarea>
                <button onClick={handleButtonClick} className="text-xl bg-sky-600 mt-6 py-2 w-1/6 hover:bg-sky-500 rounded-lg">Check</button>
            </div>
        </div>
    )
}