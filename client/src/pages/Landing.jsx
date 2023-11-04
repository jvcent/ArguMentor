import { useNavigate } from "react-router-dom";

export const Landing = () => {
    navigate = useNavigate();

    const handleButtonClick = () => {
        navigate("/input-page")
    }
    return (
        <div>
            <button onClick={handleButtonClick}>Get Started</button>
        </div>
    )
}