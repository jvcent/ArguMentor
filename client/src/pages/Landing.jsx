import { useNavigate } from "react-router-dom";

export const Landing = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate("/input")
    }
    return (
        <>
        <div className="flex flex-col justify-center items-center h-screen bg-blue-800">
            <p className="text-white text-4xl mb-10 main-font">DialogXpert</p>
            <p className="text-white main-font">DialogXpert is your study companion, helping you practice and improve your knowledge. Enter your topics or upload notes for effective learning. Start your learning journey today!</p>
            <button
                className="mt-10 cursor-pointer transition-all bg-white text-indigo-900 px-10 py-4 rounded-lg border-purple-400 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] hover:shadow-xl hover:shadow-purple-500 shadow-purple-500 active:shadow-none"
                onClick={handleButtonClick}
            >
                Get Started
            </button>
        </div>
        </>
    
    )
}

