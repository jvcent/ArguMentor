import axios from "axios";
import { useState, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const Popup = () => {
    // props
    // {userAnswer}
    const location = useLocation();
    const navigate = useNavigate();
    const {userAnswer} = location.state;
    // const userAnswer = "test"
    const [feedback, setFeedback] = useState([''])

    const apiCall = async () => {
        try {
            let body;
            body = {answer: userAnswer};
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
        <div className="flex flex-col justify-center h-screen bg-blue-800 main-font">
            <p className="text-white text-lg mb-10">Results</p>
            <div className="grid grid-cols-2 gap-4 mt-4 ">
                <div className="col-span-1 p-3 max-h-100 w-30 ml-10 bg-blue-200 overflow-y-auto whitespace-normal rounded-lg border-white border-2">
                    <div className="h-full flex items-center justify-center text-center">
                    {userAnswer}
                    </div>
                </div>
                <div className="col-span-1 mr-10 p-3 max-h-100 w-30 bg-blue-200 overflow-y-auto whitespace-normal rounded-lg border-white border-2">
                    <div className="h-full flex items-center justify-center text-center">
                        {feedback}
                    </div>
                </div>
            </div>
            {/* <div className="mt-20 ml-10 mr-10 p-4 bg-violet-200 rounded-lg border-white border-2">
                adsf
            </div> */}
            <div>
                <button onClick={handleButtonClick} className="mt-10 cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg
                    border-blue-600
                    border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
                    active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
                    Study another topic
                </button>
            </div>
        </div>
        
        </>
    
    )
}