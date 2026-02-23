// client/src/App.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css"; // Import the CSS file
import Typed from "typed.js";
const host = "https://quoteapp-5y30.onrender.com";

const App = () => {

  const [quote, setQuote] = useState({
    text: "Loading...",
    author: "Loading...",
  });
  const [searchAuthor, setSearchAuthor] = useState("");
  const autoText = useRef(null);

  const getRandomQuote = async () => {
    try {
      const response = await axios.get(`${host}/api/random`);
      // console.log("Random quote fetch data: ",response.data);
      // const {a:author, q:text} = response.data[0];

      // posting data , what we have displayed
      // await axios.post('http://localhost:5001/api/addQuote',{author,text});

      // setQuote({author,text});
      setQuote(response.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const searchByAuthor = async () => {
    try {
      const response = await axios.get(
        `${host}/api/search/${searchAuthor}`
      );

      console.log("Author quote fetch data: ", response.data);

      if (response.data.text.length > 0) {
        setQuote({
          ...response.data,
          text: response.data.text,
          author: response.data.author,
        });
      } else {
        setQuote({ text: "No quotes found.", author: "" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRandomQuote();

    const typed = new Typed(autoText.current, {
      strings: [
        "Quote of the day",
        "Find your thoughts in quotes",
        "Happiness, Love, Peace, Vibes, Calmness...",
      ],
      typeSpeed: 150,
      backSpeed: 150,
      loop: true,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);

  return (
    <div className="app-container">
      <h1 class="font-effect-fire">
        <span class="font-effect-neon">🖋 </span>
        <span ref={autoText}></span>
      </h1>

      <div className="quote-container">
        <p className="quote-text">{quote.text}</p>
        <p className="quote-author">-✍🏻{quote.author}</p>
      </div>

      <div className="buttons-container">
        <button className="button" onClick={getRandomQuote}>
          Next Quote
        </button>

        <div className="search-container">
          <input
            type="text"
            placeholder="Enter author name"
            value={searchAuthor}
            onChange={(e) => setSearchAuthor(e.target.value)}
          />
          <button className="button" onClick={searchByAuthor}>
            Search by Author
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;

