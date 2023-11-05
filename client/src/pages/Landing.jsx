import { useNavigate } from "react-router-dom";
import "./Landing.css";
import Lottie from "lottie-react";
import debate from "./assets/debate.json";

export const Landing = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate("/input")
    }
    return (
        <>
        <div className="flex flex-col justify-center items-center h-screen bg-blue-800">
            <div className="flex flex-row items-center">
                <Lottie
                        animationData={debate}
                        className="w-48"
                    />
                <p className="text-white main-font text-7xl font-semibold drop-shadow-sm">ArguMentor</p>
            </div>
            <p className="text-white main-font whitespace-normal max-w-xl text-lg">ArguMentor is your study companion, helping you practice and improve your knowledge. Enter your topics or upload notes for effective learning. Start your learning journey today!</p>
            <button
                className="mt-10 py-3 px-12 tracking-widest text-xl font-bold cursor-pointer"
                onClick={handleButtonClick}
            >
                START
            </button>
        </div>
        </>
    
    )
}

