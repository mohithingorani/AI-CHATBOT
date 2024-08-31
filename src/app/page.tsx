"use client";

import { useState, CSSProperties } from "react";
const { GoogleGenerativeAI } = require("@google/generative-ai");
import Typewriter from "typewriter-effect";
import ClipLoader from "react-spinners/ClipLoader";

export async function fetchValue(prompt: string) {
  console.log(process.env.GEMINI_API_KEY);
  const genAI = new GoogleGenerativeAI(
    process.env.NEXT_PUBLIC_GEMINI_API_KEY
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const myPrompt = `
    You are a content generator for my website. 
    Please provide clear, concise, and engaging text responses based on the input prompt. 
    Do not use stars or any special characters in your responses. 
    Only output plain text. 
    Dont use stars or hashtags.
    The content should be suitable for a general audience and formatted appropriately for web display. 
    Make sure the response is informative, accurate, and directly related to the input prompt.
    Here is the prompt: 
  `;

  const result = await model.generateContent(myPrompt + prompt);
  console.log(result.response.text);
  return result.response.text;
}

export default function Home() {
  const [data, setData] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  let [loading, setLoading] = useState(false);

  let [color, setColor] = useState("#ffffff");

  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  async function handler() {
    setData(null);
    setLoading(true);
    if (prompt != null) {
      const value = await fetchValue(prompt);
      setLoading(false);
      setData(value);
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-col justify-center items-center pt-8 gap-4">
        <input
          onChange={(e) => setPrompt(e.target.value)}
          className="border border-black px-3 py-1.5 max-w-lg w-full rounded-md"
          type="text"
          placeholder="Enter prompt"
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
