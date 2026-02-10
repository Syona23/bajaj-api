const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = 3000;
require("dotenv").config();
const GEMINI_KEY = process.env.GEMINI_KEY;
const EMAIL = "syona1062.be23@chitkara.edu.in";


function fibonacci(n) {
  let result = [];
  let a = 0, b = 1;

  for (let i = 0; i < n; i++) {
    result.push(a);
    [a, b] = [b, a + b];
  }

  return result;
}


function isPrime(num) {
  if (num < 2) return false;

  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }

  return true;
}


function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}


function lcm(a, b) {
  return (a * b) / gcd(a, b);
}


app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL
  });
});


app.post("/bfhl", async (req, res) => {
  try {

    const body = req.body;
    const keys = Object.keys(body);

  
    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        official_email: EMAIL,
        message: "Request must contain exactly one key"
      });
    }

    const key = keys[0];
    const value = body[key];

    let data;

  
    if (key === "fibonacci") {

      if (!Number.isInteger(value) || value < 0) {
        throw new Error("Invalid fibonacci input");
      }

      data = fibonacci(value);
    }


    else if (key === "prime") {

      if (!Array.isArray(value)) {
        throw new Error("Prime input must be an array");
      }

      data = value.filter(isPrime);
    }

   
    else if (key === "hcf") {

      if (!Array.isArray(value)) {
        throw new Error("HCF input must be an array");
      }

      data = value.reduce((a, b) => gcd(a, b));
    }

    else if (key === "lcm") {

      if (!Array.isArray(value)) {
        throw new Error("LCM input must be an array");
      }

      data = value.reduce((a, b) => lcm(a, b));
    }

    
else if (key === "AI") {

  if (!GEMINI_KEY) {
    throw new Error("Gemini API key missing");
  }

  const response = await axios.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      contents: [
        {
          role: "user",
          parts: [{ text: value }]
        }
      ]
    },
    {
      params: {
        key: GEMINI_KEY
      },
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  data = response.data.candidates[0].content.parts[0].text.trim();
}


 

    else {
      return res.status(400).json({
        is_success: false,
        official_email: EMAIL,
        message: "Invalid key"
      });
    }

    res.status(200).json({
      is_success: true,
      official_email: EMAIL,
      data: data
    });

  } catch (error) {

    console.error("Error:", error.message);

    res.status(500).json({
      is_success: false,
      official_email: EMAIL,
      message: error.message
    });
  }
});

/* ---------------- START SERVER ---------------- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
