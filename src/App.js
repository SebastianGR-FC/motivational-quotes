import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles.css";

const App = () => {
  const [quotes, setQuotes] = useState([]);
  const [remainingQuotes, setRemainingQuotes] = useState([]);
  const [quote, setQuote] = useState(null); // Changed initial state to null to ensure proper loading state
  const [isChanging, setIsChanging] = useState(false);
  const [loading, setLoading] = useState(true);

  // Shuffle function for randomizing quotes
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Fetch quotes from the file
  useEffect(() => {
    fetch("/quotes.txt")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        const loadedQuotes = data
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line);

        if (loadedQuotes.length === 0) {
          console.error("No quotes found in the file");
          return;
        }

        const shuffledQuotes = shuffleArray(loadedQuotes);
        setQuotes(shuffledQuotes);
        setRemainingQuotes(shuffledQuotes.slice(1));
        setQuote(shuffledQuotes[0]); // Initial quote is set here
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching quotes:", error);
        setLoading(false);
      });
  }, []);

  // Function to get the next quote
  const getNextQuote = () => {
    if (isChanging) return;
    setIsChanging(true);

    setRemainingQuotes((prev) => {
      let newRemaining = [...prev];

      if (newRemaining.length === 0) {
        newRemaining = shuffleArray([...quotes]);
        // Prevent repeating the current quote immediately
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

  // Framer Motion variants for a smooth fade
  const quoteVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <AnimatePresence mode="wait" onExitComplete={() => setIsChanging(false)}>
          {quote && (
            <motion.div
              key={quote}
              className="quote"
              variants={quoteVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {`“${quote}”`}
            </motion.div>
          )}
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