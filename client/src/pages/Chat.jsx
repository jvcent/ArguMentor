import { useNavigate } from "react-router-dom";

export const Chat = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate("/chat")
    }
    return (
        <div>
            <button onClick={handleButtonClick}>Get Started</button>
        </div>
    )
}