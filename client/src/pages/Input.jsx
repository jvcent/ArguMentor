import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import {Document, Page, pdfjs} from "react-pdf";
import {Chat} from "./Chat.jsx"

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


export const Input = () => {
    const [userInput, setUserInput] = useState('');
    const [pdfText, setPdfText] = useState('');
    const [pdfUploaded, setPdfUploaded] = useState(false);
    const navigate = useNavigate();

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];
        const fileReader = new FileReader();
    
        fileReader.onload = async () => {
          const arrayBuffer = fileReader.result;
          const typedArray = new Uint8Array(arrayBuffer);
    
          pdfjs.getDocument(typedArray).promise.then((pdf) => {
            const totalPages = pdf.numPages;
            let extractedText = '';
    
            for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
              pdf.getPage(pageNum).then((page) => {
                page.getTextContent().then((textContent) => {
                  textContent.items.forEach((item) => {
                    extractedText += item.str + ' ';
                  });
    
                  if (pageNum === totalPages) {
                    setPdfText(extractedText);
                    setPdfUploaded(true);
                  }
                });
              });
            }
          });
        };
    
        fileReader.readAsArrayBuffer(file);
      }

    const handleUserMessage = (e) => {
        e.preventDefault();
        setUserInput(e.target.value);
      };

    const handleButtonClick = async () => {
        navigate("/loading");
        try {
            let body;
            if (pdfUploaded) {
                body = {topic: pdfText};
            } else {
                body = {topic: userInput};
            }
            const response = await fetch("http://127.0.0.1:5000/start/", {
                method: "POST",
                // mode: 'no-cors',
                headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "",
                "Access-Control-Allow-Headers": "",
                "Access-Control-Allow-Methods": "POST",
                },
                body: JSON.stringify(body),
            });
            if (response.ok) {
                console.log("Data sent successfully");
            } else {
                console.error("Request failed with status:", response.status);
            }
            // let resp = "";
            // await response.json().then((data) => {
            //     console.log(data);
            //     // resp = data;
            //     resp = data.response;
            // });
            } catch (error) {
            console.log(error);
            }
    }

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: ".pdf", // Specify accepted file types
      });

    useEffect(() => {
        console.log("pdfText:", pdfText);
    }, [pdfText]);
    

    return (
        <>
            <div className="main-font bg-blue-800 flex flex-col items-center justify-center h-screen">
                <p className="text-white text-xl font-medium mb-6 ">Upload a PDF of your course notes or type in a specific topic that you want to revise</p>
                <div className="w-full flex flex-row justify-center space-x-4">
                <input type="text" onChange={handleUserMessage} className="bg-white mb-8 mt-2 w-1/3 text-lg drop-shadow-xl font-semibold text-blue-800 px-7 py-2 rounded-xl transition duration-200 ease-in-out focus:outline-none" placeholder="Enter a specific topic"></input>
                  <div>
                    {pdfUploaded ? ( // Render message when PDF is uploaded
                      <p className="text-white text-lg mb-8">PDF Successfully Uploaded!</p>
                      ) : (
                      <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <button className="bg-white mb-8 mt-2 text-blue-800 px-6 py-4 rounded-full transition duration-200 ease-in-out hover:bg-blue-100 active:bg-blue-100 focus:outline-none">Upload file</button>
                      </div>
                      )}
                  </div>
                </div>
                
                <button onClick={handleButtonClick} className="mt-5 relative py-6 px-10 text-black text-base font-bold uppercase rounded-[50px] overflow-hidden bg-white transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-violet-400 before:to-blue-500 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0">Start Revising</button>
            </div>
        </>
    )
    
}