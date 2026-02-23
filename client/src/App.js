// client/src/App.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./App.css";
import Typed from "typed.js";

const API_HOST = process.env.REACT_APP_API_URL || "http://localhost:5001";
const FAVORITES_KEY = "quote_app_favorites";
const parseQuotePayload = (payload) => {
  if (!payload) return null;
  if (Array.isArray(payload)) return payload[0] || null;
  if (payload.data) return payload.data;
  return payload;
};

const App = () => {
  const [quote, setQuote] = useState({
    id: "",
    text: "Loading...",
    author: "Loading...",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [stats, setStats] = useState({ totalQuotes: 0, totalAuthors: 0 });
  const [favorites, setFavorites] = useState([]);
  const autoText = useRef(null);

  const applyQuote = useCallback((incomingQuote) => {
    const normalizedQuote = {
      id: incomingQuote.id || incomingQuote._id || "",
      text: incomingQuote.text || "No quote text",
      author: incomingQuote.author || "Unknown",
    };
    setQuote(normalizedQuote);
  }, []);

  const getRandomQuote = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      setError("");

      const response = await axios.get(`${API_HOST}/api/random`);
      const quotePayload = parseQuotePayload(response.data);
      if (!quotePayload) {
        throw new Error("No quote returned from API");
      }
      applyQuote(quotePayload);
    } catch (error) {
      console.error("Random quote fetch failed", error);
      setError("Could not fetch quote. Check server/API connection.");
    } finally {
      setLoading(false);
    }
  }, [applyQuote]);

  const searchByAuthor = async () => {
    const author = searchAuthor.trim();
    if (!author) {
      setError("Type an author name first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_HOST}/api/search/${encodeURIComponent(author)}`);
      const quotePayload = parseQuotePayload(response.data);
      if (!quotePayload) {
        throw new Error("No quote returned from search API");
      }
      applyQuote(quotePayload);
    } catch (error) {
      console.error("Search failed", error);
      const notFound = error?.response?.status === 404;
      setError(notFound ? `No quotes found for "${author}".` : "Search failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(`${API_HOST}/api/stats`);
      const statsPayload = response?.data?.data;
      if (statsPayload) {
        setStats(statsPayload);
        return;
      }
      throw new Error("Stats payload missing");
    } catch (error) {
      // Backward compatibility when old backend does not have /api/stats.
      try {
        const fallback = await axios.get(`${API_HOST}/api`);
        const quotes = Array.isArray(fallback.data) ? fallback.data : fallback?.data?.data || [];
        const authors = new Set(quotes.map((item) => item.author).filter(Boolean));
        setStats({ totalQuotes: quotes.length, totalAuthors: authors.size });
      } catch (fallbackError) {
        console.error("Stats fetch failed", fallbackError);
      }
    }
  }, []);

  const copyQuote = async () => {
    const text = `"${quote.text}" - ${quote.author}`;
    try {
      await navigator.clipboard.writeText(text);
      setError("Copied quote to clipboard.");
      setTimeout(() => setError(""), 1200);
    } catch (clipboardError) {
      console.error("Copy failed", clipboardError);
      setError("Copy failed.");
    }
  };

  const isFavorite = favorites.some((item) => item.id === quote.id && quote.id);

  const toggleFavorite = () => {
    if (!quote.id) return;

    const favoriteQuote = { id: quote.id, text: quote.text, author: quote.author };
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === favoriteQuote.id);
      const updated = exists
        ? prev.filter((item) => item.id !== favoriteQuote.id)
        : [favoriteQuote, ...prev].slice(0, 20);

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const shareOnTwitter = () => {
    const tweetText = encodeURIComponent(`"${quote.text}" - ${quote.author}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch {
        localStorage.removeItem(FAVORITES_KEY);
      }
    }

    getRandomQuote(true);
    fetchStats();

    const typed = new Typed(autoText.current, {
      strings: [
        "Quote of the day",
        "Find your thoughts in quotes",
        "Search authors, save favorites, share wisdom...",
      ],
      typeSpeed: 90,
      backSpeed: 60,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, [fetchStats, getRandomQuote]);

  return (
    <div className="app-container">
      <h1 className="title">
        <span className="title-icon">🖋</span>
        <span ref={autoText}></span>
      </h1>

      <div className="stats-row">
        <p>{stats.totalQuotes} quotes</p>
        <p>{stats.totalAuthors} authors</p>
      </div>

      <div className="quote-container">
        <p className="quote-text">{loading ? "Loading..." : quote.text}</p>
        <p className="quote-author">-✍🏻{quote.author}</p>
      </div>

      {error ? <p className="status-message">{error}</p> : null}

      <div className="buttons-container">
        <button className="button" onClick={() => getRandomQuote()} disabled={loading}>
          Next Quote
        </button>

        <div className="search-container">
          <input
            type="text"
            placeholder="Enter author name"
            value={searchAuthor}
            onChange={(e) => setSearchAuthor(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchByAuthor();
              }
            }}
          />
          <button className="button" onClick={searchByAuthor}>
            Search by Author
          </button>
        </div>

        <div className="actions-row">
          <button className="button secondary" onClick={copyQuote}>
            Copy
          </button>
          <button className="button secondary" onClick={toggleFavorite}>
            {isFavorite ? "Unfavorite" : "Favorite"}
          </button>
          <button className="button secondary" onClick={shareOnTwitter}>
            Share
          </button>
        </div>
      </div>

      <div className="panels">
        <section className="panel">
          <h2>Favorites</h2>
          {favorites.length === 0 ? <p className="muted">No favorites saved.</p> : null}
          {favorites.map((item) => (
            <button key={item.id} className="favorite-item" onClick={() => applyQuote(item)}>
              "{item.text}" - {item.author}
            </button>
          ))}
        </section>
      </div>
    </div>
  );
};

export default App;

