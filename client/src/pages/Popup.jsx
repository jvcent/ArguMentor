import axios from "axios";
import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

export const Popup = () => {
    // {userAnswer}
    const navigate = useNavigate();
    const [userAnswer, setUserAnswer] = useState('')
    const [feedback, setFeedback] = useState('')

    useEffect(() => {
        // Make an asynchronous request to your backend to fetch feedback
        const fetchFeedback = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/answer/"); // Replace with the actual endpoint to fetch feedback
                setFeedback(response.data); // Assuming your feedback is a string
            } catch (error) {
                console.error("Error fetching feedback:", error);
            }
        };

        fetchFeedback(); // Call the function to fetch feedback when the component mounts
    }, []);

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
                    {/* {userAnswer} */}
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam faucibus sapien justo, non convallis nulla tincidunt nec.
                    Aliquam erat volutpat. Vivamus tristique fringilla quam, nec lacinia tortor eleifend vel. Phasellus malesuada urna et massa rhoncus, vel fringilla tortor malesuada.
                    Quisque vestibulum, ipsum ac tempus gravida, purus neque volutpat tortor, a varius urna elit non mi. Nullam malesuada tortor nec tellus blandit, eget congue justo feugiat.
                    Sed id sollicitudin est. Sed bibendum, dui vel accumsan bibendum, erat lorem congue justo, nec sollicitudin lectus ligula ac justo. Sed euismod, nisl eget ultricies ultrices,
                    </div>
                </div>
                <div className="col-span-1 mr-10 p-3 max-h-100 w-30 bg-blue-200 overflow-y-auto whitespace-normal rounded-lg border-white border-2">
                    <div className="h-full flex items-center justify-center text-center">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam faucibus sapien justo, non convallis nulla tincidunt nec.
                        Aliquam erat volutpat. Vivamus tristique fringilla quam, nec lacinia tortor eleifend vel. Phasellus malesuada urna et massa rhoncus, vel fringilla tortor malesuada.
                        Quisque vestibulum, ipsum ac tempus gravida, purus neque volutpat tortor, a varius urna elit non mi. Nullam malesuada tortor nec tellus blandit, eget congue justo feugiat.
                        Sed id sollicitudin est. Sed bibendum, dui vel accumsan bibendum, erat lorem congue justo, nec sollicitudin lectus ligula ac justo. Sed euismod, nisl eget ultricies ultrices,
                        {/* {feedback} */}
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