import { useNavigate } from "react-router-dom";

export const Chat = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate("/chat")
    }
    return (
        <div className="h-screen w-screen flex flex-row items-center justify-center bg-blue-900 p-12">
            <div className="h-full "></div>
            <div></div>
        </div>
    )
}