import "./Chat.css"
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

export const Chat = () => {
    // const location = useLocation();
    // const { data } = location.state || {}; 

    // Now you can use pdfText and userInput

    // console.log("data:", data);
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate("/popup")
    }

    const [active, setActive] = useState();

    const [chatMessages, setChatMessages] = useState([]);

    const [apiCall, setApiCall] = useState([])


    const fetchChatMessages = async () => {
        try {
            setActive(true);
            const response = await fetch("http://127.0.0.1:5000/next/");
            if (response.ok) {
                const data = await response.json();
                const responseText = data.response
                setChatMessages((prevMessages) => [...prevMessages, responseText]);
            } else {
                console.error('Failed to fetch chat messages')
            }
        } catch (error) {
            console.error("Next API Call Error:", error);
        } finally {
            setActive(false); // Reset the API call status when done
        }

    }

    useEffect(() => {
        if (!active) { // Check if an API call is not in progress
          setTimeout(() => {
            fetchChatMessages();
          }, 5000);
        }
      }, [chatMessages, active]);

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
        <div className="text-white main-font h-screen w-screen flex flex-row items-center justify-center bg-blue-800 p-12 ">
            <div className="h-full w-3/5 bg-blue-900 rounded-l-[50px] flex flex-row justify-center">
                <div className="flex flex-col justify-end"><span>Bot 1</span></div>
                <ScrollToBottom className="flex flex-col h-5/6 w-5/6 justify-center items-center overflow-auto mt-3 p-3">
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
                            className="text-white text-right whitespace-normal bg-orange-400 flex flex-row-reverse justify-start h-auto mt-4 p-4 ml-10 rounded-t-2xl rounded-bl-2xl"
                            key={index}
                            >
                            {message}
                            </div>
                        )
                    ))}
                </ScrollToBottom>
                <div className="flex flex-col justify-end"><span>Bot 2</span></div>
            </div>

            <div className="h-full w-2/5 bg-indigo-900 rounded-r-[50px] flex flex-col items-center">
                <h1 className="text-2xl mt-10 font-semibold">Which chatbot went wrong?</h1>
                <div className="flex flex-row space-x-2 justify-center">
                    <button onClick={() => setActive(1)} 
                    className={`text-xl py-2 mt-4 px-4 rounded-lg ${active === 1 ? "bg-sky-400" : "bg-sky-600"}`}>
                        Chatbot 1</button>
                    <button onClick={() => setActive(2)} 
                    className={`text-xl py-2 mt-4 px-4 rounded-lg ${active === 2 ? "bg-sky-400" : "bg-sky-600"}`}>
                        Chatbot 2</button>
                </div>

                <h1 className="text-2xl mt-12 font-semibold">Justify your answer</h1>
                <textarea className="justify-box h-1/2 w-5/6 p-4 bg-indigo-950 mx-6 mt-4 whitespace-normal " placeholder="Enter explanation"></textarea>
                <button onClick={handleButtonClick} className="text-xl bg-sky-600 mt-6 py-2 w-1/6 hover:bg-sky-500 rounded-lg">Check</button>
            </div>
        </div>
    )
}