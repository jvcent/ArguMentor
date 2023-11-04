import { useNavigate } from "react-router-dom";

export const Chat = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate("/chat")
    }
    return (
        <div className="text-white main-font h-screen w-screen flex flex-row items-center justify-center bg-blue-800 p-12 ">
            <div className="h-full w-3/5 bg-blue-900 rounded-l-[50px] flex flex-row">

            </div>
            <div className="h-full w-2/5 bg-indigo-900 rounded-r-[50px] flex flex-col">
                <text>Which chatbot went wrong?</text>
            </div>
        </div>
    )
}