import axios from "axios";
import { useState, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const Popup = () => {
    // props
    const location = useLocation();
    const navigate = useNavigate();
    const {combinedAnswer} = location.state;
    
    const [feedback, setFeedback] = useState([''])

    const apiCall = async () => {
        try {
            let body;
            body = {answer: combinedAnswer};
            const response = await fetch("http://127.0.0.1:5000/answer/", {
                method: "POST",
                // mode: 'no-cors',
                headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "",
                "Access-Control-Allow-Headers": "",
                "Access-Control-Allow-Methods": "POST",
                },
                body: JSON.stringify(body),
            });
            // if (response.ok) {
            //     console.log("Data sent successfully");
            //     navigate("/chat");
            // } else {
            //     console.error("Request failed with status:", response.status);
            // }
            let resp = "";
            await response.json().then((data) => {
                console.log(data);
                // resp = data;
                resp = data.response;
                setFeedback((prev) => [...prev, resp])
            });
            } catch (error) {
            console.log(error);
            }
    }

    useEffect(() => {
        // Call the apiCall function when the component mounts
        apiCall();
    }, []);

    // useEffect(() => {
    //     // Make an asynchronous request to your backend to fetch feedback
    //     const fetchFeedback = async () => {
    //         try {
    //             const response = await fetch("http://127.0.0.1:5000/answer/");
    //             if (response.ok) {
    //                 const data = await response.json();
    //                 const responseText = data.response
    //                 setFeedback(responseText);
    //             } else {
    //                 console.error('Failed to fetch chat messages')
    //             }
    //         } catch (error) {
    //             console.error("API Call Error:", error);
    //         }
    //     };

    //     fetchFeedback(); // Call the function to fetch feedback when the component mounts
    // }, []);

    const handleButtonClick = () => {
        navigate('/input')
    }

    return (
        <>
        <div className="flex flex-col justify-center w-screen h-screen bg-blue-800 p-12 main-font">
            <div className="flex flex-col justify-center w-full h-full bg-blue-900 rounded-[60px]">
                <p className="text-white text-3xl font-bold tracking-widest mb-3 mt-12">RESULTS</p>
                <div className="flex flex-row mt-4 w-full h-full justify-center space-x-4">
                    <div className="w-2/5 p-3 bg-blue-300 overflow-y-auto whitespace-normal rounded-lg border-white border-2">
                        <span className="text-xl font-semibold">YOUR ANSWER</span>
                        <div className="h-5/6 flex items-center justify-center text-left">
                        {combinedAnswer}
                        </div>
                    </div>
                    <div className="w-2/5 p-3 bg-blue-300 overflow-y-auto whitespace-normal rounded-lg border-white border-2">
                        <span className="text-xl font-semibold">FEEDBACK</span>
                        <div className="h-5/6 flex items-center justify-center text-left">
                            {feedback}
                        </div>
                    </div>
                </div>
                <div>
                    <button onClick={handleButtonClick} className="mt-10 mb-12 cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg
                        border-blue-600
                        border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
                        active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
                        Study another topic
                    </button>
                </div>
            </div>
        </div>
        
        </>
    
    )
}