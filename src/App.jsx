import { useState } from "react";
import { motion } from "framer-motion";
import "./App.css";

function App() {
  // Main café intent
  const [selectedIntent, setSelectedIntent] = useState(null);

  // User preferences
  const [preferences, setPreferences] = useState([]);

  // User location
  const [location, setLocation] = useState(null);

  // List of nearby cafés
  const [cafes, setCafes] = useState([]);

  // Location status: idle | loading | success | error | unsupported
  const [locationStatus, setLocationStatus] = useState("idle");

  // Search input state for manual entry
  const [searchQuery, setSearchQuery] = useState("");

  // Toggle a preference on/off
  const togglePreference = (preference) => {
    setPreferences((current) =>
      current.includes(preference)
        ? current.filter((item) => item !== preference)
        : [...current, preference]
    );
  };

  // Get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
      return;
    }

    setLocationStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("User location:", latitude, longitude);

        const newLocation = { latitude, longitude };
        setLocation(newLocation);
        setLocationStatus("success");
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationStatus("error");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Find nearby cafés using Overpass API
  async function findNearbyCafes() {
    if (!location) {
      alert("Please get your location first using 'Find cafés near me'.");
      getUserLocation();
      return;
    }

    try {
      const { latitude, longitude } = location;
      const query = `
        [out:json];
        node["amenity"="cafe"](around:3000,${latitude},${longitude});
        out;
      `;
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setCafes(data.elements || []);
      console.log("Nearby cafés:", data.elements);
    } catch (err) {
      console.error("Failed to fetch cafés:", err);
      alert("Could not fetch nearby cafés. Please try again.");
    }
  }

  // Handle manual search form submission
  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    alert(`Searching for location: ${searchQuery}`);
  };

  return (
    <main className="app">
      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <div className="logo">
          Café<span>Finder</span> ☕
        </div>

        <div className="nav-links">
          <a href="#explore">Explore</a>
          <a href="#how-it-works">How it works</a>
        </div>

        <button className="nav-button" onClick={getUserLocation}>Get Started</button>
      </nav>

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-content">
          <motion.div
            className="badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            ✨ Your perfect café is closer than you think
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Find the café
            <br />
            <span>that fits you.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Tell us what you're looking for and discover cafés
            around you that match your mood, needs and preferences.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* FIND NEAR ME */}
            <button
              className="primary-button"
              onClick={getUserLocation}
              disabled={locationStatus === "loading"}
            >
              {locationStatus === "loading"
                ? "📍 Finding you..."
                : "📍 Find cafés near me"}
            </button>

            <button className="secondary-button" onClick={findNearbyCafes}>
               Test Nearby Cafés
            </button>

            {/* SEARCH LOCATION BUTTON */}
            <button
              className="secondary-button"
              onClick={() => {
                document
                  .getElementById("search-section")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              🔎 Search a location
            </button>
          </motion.div>

          {/* ================= LOCATION STATUS ================= */}
          {locationStatus === "success" && location && (
            <motion.div
              className="location-success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              📍 Location detected successfully
              <br />
              <small>
                Latitude: {location.latitude}
                <br />
                Longitude: {location.longitude}
              </small>
            </motion.div>
          )}

          {locationStatus === "error" && (
            <div className="location-error">
              We couldn't access your location.
              <br />
              Please allow location access and try again.
            </div>
          )}

          {locationStatus === "unsupported" && (
            <div className="location-error">
              Your browser doesn't support location services.
            </div>
          )}

          <div className="trust">
            <span>☕</span>
            Discover
            <span>•</span>
            Compare
            <span>•</span>
            Enjoy
          </div>
        </div>

        {/* ================= COFFEE VISUAL ================= */}
        <div className="hero-visual">
          <motion.div
            className="glow"
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="coffee-scene"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 1, 0, -1, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="coffee-shadow" />
            <div className="cup">
              <div className="coffee" />
              <div className="cup-handle" />
            </div>
            <div className="saucer" />
          </motion.div>

          {/* RATING CARD */}
          <motion.div
            className="floating-card card-rating"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ⭐ <strong>4.8</strong>
            <small>Top rated</small>
          </motion.div>

          {/* LOCATION CARD */}
          <motion.div
            className="floating-card card-location"
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            📍 <strong>0.8 km</strong>
            <small>Near you</small>
          </motion.div>
        </div>
      </section>

      {/* ================= CAFÉ RESULTS SECTION (Fixed Position) ================= */}
      {cafes.length > 0 && (
        <section className="cafe-results">
          <div className="results-header">
            <div>
              <span className="results-eyebrow">YOUR CAFÉ DISCOVERY</span>
              <h2>Cafés near you</h2>
              <p>
                We found {cafes.length}{" "}
                {cafes.length === 1 ? "place" : "places"} around you.
              </p>
            </div>
          </div>

          <div className="cafes-list">
            {cafes.map((cafe) => (
              <article className="cafe-card" key={cafe.id}>
                <div className="cafe-card-top">
                  <span className="cafe-category">CAFÉ</span>
                  <span className="cafe-icon">☕</span>
                </div>

                <div className="cafe-card-content">
                  <h3>{cafe.tags?.name || "Unnamed Café"}</h3>
                  <p className="cafe-location">
                    📍 {cafe.lat?.toFixed(4)}, {cafe.lon?.toFixed(4)}
                  </p>
                </div>

                <button className="cafe-details-button">
                  View details
                  <span>→</span>
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ================= SEARCH ================= */}
      <section id="search-section" className="search-section">
        <form className="search-box" onSubmit={handleManualSearch}>
          <span>📍</span>
          <input
            type="text"
            placeholder="Enter a city or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </section>

      {/* ================= PREFERENCES ================= */}
      <section className="preferences-section" id="explore">
        <div className="section-heading">
          <span className="section-label">
            PERSONALIZED DISCOVERY
          </span>

          <h2>
            What kind of café
            <br />
            are you looking for?
          </h2>

          <p>
            Choose what matters to you and we'll find places
            that match your needs.
          </p>
        </div>

        {/* INTENT CARDS */}
        <div className="intent-grid">
          <button
            type="button"
            className={`intent-card ${
              selectedIntent === "study" ? "selected" : ""
            }`}
            onClick={() => setSelectedIntent("study")}
          >
            <span className="intent-icon">💻</span>
            <span className="intent-title">Study & Work</span>
            <span className="intent-description">Quiet places, Wi-Fi & outlets</span>
          </button>

          <button
            type="button"
            className={`intent-card ${
              selectedIntent === "coffee" ? "selected" : ""
            }`}
            onClick={() => setSelectedIntent("coffee")}
          >
            <span className="intent-icon">☕</span>
            <span className="intent-title">Coffee & Chill</span>
            <span className="intent-description">Relax and enjoy your coffee</span>
          </button>

          <button
            type="button"
            className={`intent-card ${
              selectedIntent === "meeting" ? "selected" : ""
            }`}
            onClick={() => setSelectedIntent("meeting")}
          >
            <span className="intent-icon">👥</span>
            <span className="intent-title">Meeting</span>
            <span className="intent-description">Comfortable places to talk</span>
          </button>

          <button
            type="button"
            className={`intent-card ${
              selectedIntent === "date" ? "selected" : ""
            }`}
            onClick={() => setSelectedIntent("date")}
          >
            <span className="intent-icon">❤️</span>
            <span className="intent-title">Date</span>
            <span className="intent-description">Cozy places for two</span>
          </button>
        </div>

        {/* PREFERENCES BOX */}
        <div className="preferences-box">
          <div>
            <span className="section-label">
              YOUR PREFERENCES
            </span>
            <h3>What matters to you?</h3>
          </div>

          <div className="preference-options">
            <button
              type="button"
              className={`preference-pill ${
                preferences.includes("Wi-Fi") ? "selected" : ""
              }`}
              onClick={() => togglePreference("Wi-Fi")}
            >
              📶 Wi-Fi
            </button>

            <button
              type="button"
              className={`preference-pill ${
                preferences.includes("Power outlets") ? "selected" : ""
              }`}
              onClick={() => togglePreference("Power outlets")}
            >
              🔌 Power outlets
            </button>

            <button
              type="button"
              className={`preference-pill ${
                preferences.includes("Open now") ? "selected" : ""
              }`}
              onClick={() => togglePreference("Open now")}
            >
              🟢 Open now
            </button>

            <button
              type="button"
              className={`preference-pill ${
                preferences.includes("Outdoor") ? "selected" : ""
              }`}
              onClick={() => togglePreference("Outdoor")}
            >
              🌿 Outdoor
            </button>

            <button
              type="button"
              className={`preference-pill ${
                preferences.includes("Highly rated") ? "selected" : ""
              }`}
              onClick={() => togglePreference("Highly rated")}
            >
              ⭐ Highly rated
            </button>

            <button
              type="button"
              className={`preference-pill ${
                preferences.includes("Affordable") ? "selected" : ""
              }`}
              onClick={() => togglePreference("Affordable")}
            >
              💰 Affordable
            </button>
          </div>

          {/* SELECTION MESSAGE */}
          {selectedIntent && (
            <p className="selection-message">
              ✨ Great! We'll look for a café for{" "}
              <strong>
                {selectedIntent === "study"
                  ? "studying & working"
                  : selectedIntent === "coffee"
                  ? "coffee & chilling"
                  : selectedIntent === "meeting"
                  ? "your meeting"
                  : "your date"}
              </strong>
              {preferences.length > 0 &&
                ` with ${preferences.length} preference${
                  preferences.length > 1 ? "s" : ""
                } selected.`}
            </p>
          )}

          <button className="discover-button" onClick={findNearbyCafes}>
            Find my cafés →
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;