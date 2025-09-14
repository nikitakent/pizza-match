import React, { useState } from "react";
import { ethers } from "ethers";
import './App.css';
// ...existing code...
export default QuizApp;

const KAIGAN_CHAIN_ID = 5278000;
const NFT_CONTRACT_ADDRESS = "0x95352bC06c507b2390199BB0D63fB84cEc060Ecc"; 
const NFT_ABI = [
  "function mint(address to, string memory tokenURI) public"
];

const questions = [
  {
    text: "Do you have allergies?",
    answers: ["Yes", "No", "I am white so I pretend like I do"],
  },
  {
    text: "When you cry, how long for on average?",
    answers: ["10 minutes +", "1 minute", "<1 minute"],
  },
  {
    text: "Why did you come to Japan?",
    answers: [
      "The culture (anime)",
      "To build my future virtual wife",
      "To recreate lost in translation",
      "To improve my english"
    ]
  },
  {
    text: "What hotel in Japan is your fav?",
    answers: [
      "Park Hyatt",
      "Digital Garage",
      "Apa Hotel",
      "Modern Dormy Inn in Nagoya",
    ],
  },
  {
    text: "What is your favourite convenience store drink?",
    answers: [
      "CC LEMON",
      "TANSAN EXTRA",
      "HEPALYSE PREMIUM +++++",
      "HEPALYSE BUDGET",
    ],
  },
  {
    text: "What is your favourite train line?",
    answers: [
      "Oedo",
      "Setagaya",
      "self driving waymos",
      "I bought shares in Odakyu",
      "Yamanote",
    ],
  },
];

function getRandomStars(numStars = 20) {
  const stars = [];
  for (let i = 0; i < numStars; i++) {
    const top = Math.random() * 90;
    const left = Math.random() * 95;
    stars.push(
      <div
        className="star"
        key={i}
        style={{ top: `${top}%`, left: `${left}%` }}
      >
        <svg viewBox="0 0 32 32" fill="none">
          <polygon points="16,2 20,12 31,12 22,18 25,29 16,23 7,29 10,18 1,12 12,12" fill="#a259f7" />
        </svg>
      </div>
    );
  }
  return stars;
}

function getPizzaFlavours(pizzaType) {
  const flavours = {
    'Romana': 'Tomato, mozzarella, anchovies, oregano, olive oil',
    '5 Formaggi': 'Mozzarella, gorgonzola, fontina, parmesan, provolone',
    'Marinara': 'Tomato, garlic, oregano, olive oil',
    'Diavola': 'Tomato, mozzarella, spicy salami, chili',
    'Puttanesca': 'Tomato, olives, capers, anchovies, garlic',
    'Margherita': 'Tomato, mozzarella, basil, olive oil',
  };
  return flavours[pizzaType] || '';
}

function getPizzaType(answers) {
  const mapping = {
    'HEPALYSE PREMIUM +++++': 'Romana',
    'Modern Dormy Inn in Nagoya - highly recommend the bathrooms': '5 Formaggi',
    'I am white so I pretend like I do': 'Marinara',
    '<1 minute - Supreme pizza': 'Diavola',
    'I bought shares in Odakyu': 'Puttanesca',
    'Yes': 'Margherita',
  };
  for (const ans of answers) {
    if (mapping[ans]) {
      return mapping[ans];
    }
  }
  return null;
}


function QuizApp() {
  const [currentQ, setCurrentQ] = useState(-1);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const handleStart = () => setCurrentQ(0);
  const handleAnswer = (answer) => {
    setAnswers([...answers, answer]);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setFinished(true);
    }
  };
  const pizzaType = finished ? getPizzaType(answers) : null;

  return (
    <div className="App-header">
      {getRandomStars(20)}
      <div className="max-w-xl w-full shadow-2xl rounded-2xl bg-white relative z-10">
        <div className="p-6 space-y-6">
          {currentQ === -1 && (
            <div className="kawaii-card" style={{textAlign: 'center'}}>
              <h1 className="kawaii-question" style={{fontSize: '2.2rem', marginBottom: '1em'}}>Find out what pizza you are!</h1>
              <button className="kawaii-btn" onClick={handleStart}>
                <span role="img" aria-label="sparkle">🍕</span> Start Quiz <span role="img" aria-label="sparkle">🍕</span>
              </button>
            </div>
          )}
          {currentQ >= 0 && !finished && (
            <React.Fragment>
              <h2 className="kawaii-question">
                {questions[currentQ].text}
              </h2>
              <div className="grid gap-3">
                {questions[currentQ].answers.map((a, i) => (
                  <button
                    key={i}
                    className="w-full justify-start text-left kawaii-btn"
                    onClick={() => handleAnswer(a)}
                  >
                    <span className="kawaii-answer"><span role="img" aria-label="sparkle">✨</span> {a} <span role="img" aria-label="sparkle">✨</span></span>
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                Question {currentQ + 1} of {questions.length}
              </p>
            </React.Fragment>
          )}
          {finished && (
            <div className="kawaii-card">
              {pizzaType && (
                <div className="pizza-result">
                  <span style={{fontSize: '2rem'}}>🍕</span>
                  <h3 className="pizza-name">You are a {pizzaType}!</h3>
                  <div className="pizza-flavours">{getPizzaFlavours(pizzaType)}</div>
                  <img
                    className="pizza-img"
                    src={process.env.PUBLIC_URL + '/img/' + pizzaType.replace(/\s/g, '') + '.png'}
                    alt={pizzaType + ' pizza'}
                  />
                  <button
                    className="kawaii-btn"
                    style={{marginTop: '1em', background: 'linear-gradient(90deg,#ffe6f7,#a259f7)'}}
                    onClick={() => handleMintNFT(pizzaType)}
                  >
                    <span role="img" aria-label="sparkle">🪙</span> Mint My Pizza NFT <span role="img" aria-label="sparkle">🪙</span>
                  </button>
                </div>
              )}
              <button
                className="kawaii-btn"
                onClick={() => {setCurrentQ(-1); setAnswers([]); setFinished(false);}}
              >
                <span role="img" aria-label="sparkle">🌸</span> Restart Quiz <span role="img" aria-label="sparkle">🌸</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper to get pizza flavours


async function handleMintNFT(pizzaType) {
  if (!window.ethereum) {
    alert("Please install MetaMask or a compatible wallet.");
    return;
  }
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.BrowserProvider(window.ethereum, KAIGAN_CHAIN_ID);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
  const imageUrl = process.env.PUBLIC_URL + '/img/' + pizzaType.replace(/\s/g, '') + '.png';
  const tokenURI = imageUrl;
  try {
    const tx = await contract.mint(await signer.getAddress(), tokenURI);
    alert("Minting transaction sent! Tx hash: " + tx.hash);
  } catch (err) {
    alert("Minting failed: " + err.message);
  }
}
