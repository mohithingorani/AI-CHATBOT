"use client";

import { useEffect, useState, CSSProperties } from "react";
const { GoogleGenerativeAI } = require("@google/generative-ai");
import Typewriter from "typewriter-effect";
import ClipLoader from "react-spinners/ClipLoader";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';




export default function Home() {
  const [data, setData] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const[context, setContext] = useState<string[]>([]);

  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  // This useEffect will run when 'data' changes
  useEffect(() => {
    if (data && data.trim()) {
      console.log("Data for speech synthesis:", data);
      const utterance = new SpeechSynthesisUtterance(data);
      const voice = speechSynthesis.getVoices().find(voice => voice.name === 'Google UK English Female');
      utterance.voice = voice || null;
      window.speechSynthesis.speak(utterance);
    } else {
      console.log("No valid data for speech synthesis");
    }
  }, [data]);

  async function handler() {
    setData(null);
    setLoading(true);

    async function fetchValue(prompt: string) {
      console.log(process.env.GEMINI_API_KEY);
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
      const myPrompt = `
          You are a content generator for my website. 
          Please provide clear, concise, and engaging text responses based on the input prompt. 
          Do not use stars or any special characters in your responses. 
          Only output plain text. 
          Dont use * or # in response.
          Make the content short
          This is the context "${context}"  
          The content should be suitable for a general audience and formatted appropriately for web display. 
          Make sure the response is informative, accurate, and directly related to the input prompt.
          Here is the prompt: 
          Here is the prompt: 
          The prompt is: ${prompt}
        `;
    
      const result = await model.generateContent(myPrompt + prompt);
      console.log(result.response.text);
      return result.response.text;
    }


    if (prompt != null) {
      try {
        const value = await fetchValue(prompt);
        setData(value); 
        setContext((prevContext) => [...prevContext, prompt]);
        console.log("Fetched Value:", value);
      } catch (e) {
        console.error("Error fetching value:", e);
        setData("Error");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      {/* {JSON.stringify(prompt)}
      {JSON.stringify(context)} */}
      <div className="flex flex-col justify-center items-center pt-8 gap-4 px-4">
        <input
          onChange={(e) => setPrompt(e.target.value)}
          className="border border-black px-3 py-1.5 max-w-lg w-full rounded-md"
          type="text"
          placeholder="Enter prompt"
          style={{ maxWidth: "100%" }} // Add this style to make the input responsive
        />
        <button
          onClick={handler}
          className="border hover:shadow-md px-3 py-1.5 rounded-md bg-slate-200"
        >
          Generate
        </button>
        <div className="max-w-lg">
          {data ? (
            <Typewriter
              options={{
                cursor: "", // This hides the cursor after typing
              }}
              onInit={(typewriter) => {
                typewriter
                  .changeDelay(20)
                  .typeString(data)
                  .callFunction(() => {
                    console.log("String typed out!");
                  })
                  .start();
              }}
            />
          ) : null}

          <ClipLoader
            color={color}
            loading={loading}
            cssOverride={override}
            size={30}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      </div>
    </div>
  );
}
