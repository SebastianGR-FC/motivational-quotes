import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles.css";

const App = () => {
  const [quotes, setQuotes] = useState([]);
  const [remainingQuotes, setRemainingQuotes] = useState([]);
  const [quote, setQuote] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const [loading, setLoading] = useState(true);  // Add loading state

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    fetch("/quotes.txt")
      .then((response) => response.text())
      .then((data) => {
        const loadedQuotes = data
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line);

        if (loadedQuotes.length === 0) return;

        const shuffledQuotes = shuffleArray(loadedQuotes);
        setQuotes(shuffledQuotes);
        setRemainingQuotes(shuffledQuotes.slice(1));
        setQuote(shuffledQuotes[0]);
        setLoading(false);  // Set loading to false when quotes are loaded
      });
  }, []);

  const getNextQuote = () => {
    if (isChanging) return;
    setIsChanging(true);

    setRemainingQuotes((prev) => {
      let newRemaining = [...prev];

      if (newRemaining.length === 0) {
        newRemaining = shuffleArray([...quotes]);

        // Ensure the new quote is different from the current one
        if (newRemaining[0] === quote) {
          const first = newRemaining.shift();
          newRemaining.push(first);
        }
      }

      const nextQuote = newRemaining.shift();
      setQuote(nextQuote);
      return newRemaining;
    });
  };

  const quoteVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 100, opacity: 0 },
  };

  return (
    <div className="container">
      {loading ? (
        <p>Loading...</p>  // Display loading message
      ) : (
        <AnimatePresence mode="wait" onExitComplete={() => setIsChanging(false)}>
          <motion.div
            key={quote}
            className="quote"
            variants={quoteVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1 }}
          >
            <motion.span className="animated-quote">{`“${quote}”`}</motion.span>
          </motion.div>
        </AnimatePresence>
      )}

      <button
        className="apple-style-btn"
        onClick={getNextQuote}
        disabled={isChanging}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="apple-icon"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          <path d="M9.29 15.88L13.17 12 9.29 8.12c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l4.59 4.59c.39.39.39 1.02 0 1.41L10.7 17.29c-.39.39-1.02.39-1.41 0-.39-.39-.39-1.02 0-1.41z" />
        </svg>
      </button>
    </div>
  );
};

export default App;