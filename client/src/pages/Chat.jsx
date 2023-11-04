import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const Chat = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate("/chat")
    }

    const bots = ["Chatbot 1", "Chatbot 2"];
    const [active, setActive] = useState(bots[0]);

    return (
        <div className="text-white main-font h-screen w-screen flex flex-row items-center justify-center bg-blue-800 p-12 ">
            <div className="h-full w-3/5 bg-blue-900 rounded-l-[50px] flex flex-row">
            </div>

            <div className="h-full w-2/5 bg-indigo-900 rounded-r-[50px] flex flex-col items-center">
                <h1 className="text-2xl mt-10 font-semibold">Which chatbot went wrong?</h1>
                <div className="flex flex-row space-x-2 justify-center">
                    {bots.map((bot) => (
                        <button className="text-xl bg-sky-600 active:bg-sky-500 py-2 mt-4 px-4 rounded-lg" active={active === bot} onClick={() => setActive(bot)}>
                        {bot}
                        </button>
                    ))}
                </div>

                <h1 className="text-2xl mt-12 font-semibold">Justify your answer</h1>
                <input className="h-1/2 w-5/6 bg-indigo-950 mx-6 mt-4 whitespace-normal"></input>
                <button className="text-xl bg-sky-600 mt-6 py-2 w-1/6 hover:bg-sky-500 rounded-lg">Check</button>
            </div>
        </div>
    )
}