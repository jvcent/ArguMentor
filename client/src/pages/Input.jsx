import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import {Document, Page} from 'pdfjs-dist/build/pdf'

export const Input = () => {
    // const [userInput, setUserInput] = useState('');
    const [pdfText, setPdfText] = useState('');
    const navigate = useNavigate();

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = async () => {
            const pdfData = new Uint8Array(fileReader.result);
            const doc = await Document.load(pdfData);
            const text = await doc.getPage(1).getTextContent();
            const pdfText = text.items.map((item) => item.str).join(" ");
            setPdfText(pdfText);
            console.log(pdfText);
        }

    }

    // const handleUserMessage = (e) => {
    //     e.preventDefault();
    //     setUserInput(e.target.value);
    //   };

    const handleButtonClick = async () => {
        try {
            const data = { pdfText };
            const response = await axios.post("backend-endpoint", data);
            console.log("Response from the server:", response.data);
            navigate("/chat");
        } catch (error) {
            console.error("Error sending data to the server:", error);
            // Handle errors as needed
        }
    }

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: ".pdf", // Specify accepted file types
      });

    return (
        <>
            <div className="main-font bg-blue-800 flex flex-col items-center justify-center h-screen">
                <p className="text-white text-lg mb-8">Instructions: Upload a PDF of your course notes/lecture notes that you want to practice studying.</p>
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <button className="bg-white mb-8 mt-2 text-blue-800 px-4 py-2 rounded-full transition duration-200 ease-in-out hover:bg-blue-100 active:bg-blue-100 focus:outline-none">Click to select a file</button>
                </div>
                {/* <input type="text" value={userInput} onChange={handleUserMessage} placeholder="Enter your topic" className="mb-8 relative bg-gray-50ring-0 outline-none border border-neutral-500 text-neutral-900 placeholder-indigo-900 text-sm rounded-lg focus:ring-violet-500  focus:border-violet-500 block w-64 p-2.5 checked:bg-emerald-500"/> */}
                <button className="mt-5 relative py-2 px-8 text-black text-base font-bold uppercase rounded-[50px] overflow-hidden bg-white transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-violet-400 before:to-blue-500 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0" onClick={handleButtonClick}>Start Practicing</button>
            </div>
        </>
    )
    
}