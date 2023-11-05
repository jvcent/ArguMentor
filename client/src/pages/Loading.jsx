import { useNavigate } from "react-router-dom"
import { useEffect } from "react";

export const Loading = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Set a timeout to navigate after 7 seconds (7000 milliseconds)
        const timeoutId = setTimeout(() => {
            navigate('/chat'); // Replace '/your-target-route' with the route you want to navigate to
        }, 7000);

        // Clear the timeout if the component unmounts to avoid memory leaks
        return () => {
            clearTimeout(timeoutId);
        };
    }, [navigate]);

    return (
        <>
        <div className="main-font bg-blue-800 flex flex-col items-center justify-center h-screen">
            <p className="text-white text-5xl font-semibold">Loading...</p>
            <div class="mt-10 flex flex-row gap-2">
                <div class="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:.7s]"></div>
                <div class="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:.3s]"></div>
                <div class="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:.7s]"></div>
            </div>
        </div>
    
        </>
    );
}





