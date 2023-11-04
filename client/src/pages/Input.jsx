import { useNavigate } from "react-router-dom";

export const Input = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate("/input")
    }
    return (
        <div>
            <button onClick={handleButtonClick}>Get Started</button>
        </div>
    )
}