import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export const Input = () => {
    const [userInput, setUserInput] = useState('');
    const navigate = useNavigate();

    const handleUserMessage = (e) => {
        e.preventDefault();
        setUserInput(e.target.value);
      };

    const handleButtonClick = async () => {
        try {
            const data = { userInput };
            const response = await axios.post("/your-backend-endpoint", data);
            console.log("Response from the server:", response.data);
            navigate("/input");
        } catch (error) {
            console.error("Error sending data to the server:", error);
            // Handle errors as needed
        }
    }
    return (
        <>
            <div>
                <p>Instructions: Type in a specific topic you want to practice about.</p>
                <input type="text" value={userInput} onChange={handleUserMessage} placeholder="Enter your topic"/>
                <button onClick={handleButtonClick}>Send</button>
            </div>
        </>
    )
}