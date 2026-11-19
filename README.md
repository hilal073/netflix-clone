# 🎬 Netflix Clone (React 19 + Vite + Tailwind CSS v4)

A responsive, production-ready Netflix Clone web application built with modern React 19, Vite, Tailwind CSS v4, Lucide Icons, and TMDB API.

> 📖 **Read the full project breakdown:** [HOW_I_BUILT_THIS.md](HOW_I_BUILT_THIS.md)

---

## 🌟 Key Features

- **Cinematic Hero Billboard:** Dynamic featured title with backdrop vignettes, badges, synopsis, and Play/More Info actions.
- **Dedicated Category Views:** Independent content feeds and genre filter pills for **Home**, **TV Shows**, **Movies**, **New & Popular**, and **My List**.
- **Interactive Movie Rows:** Smooth horizontal carousels with chevron buttons and hover expansion cards.
- **Official HD Video Trailers:** Instant trailer playback modal with title metadata, match percentage, and YouTube link.
- **Authentication Flow:** Full Sign In and Sign Up with validation, session persistence, and One-Click Demo Login.
- **Live Search with Debounce:** 350ms debounced search query engine across titles and genres.
- **Watchlist ("My List"):** Persistent client-side watchlist with local storage support.
- **Dual-Mode Data Layer:** Instant zero-setup demo mode with curated titles; seamlessly connects to live TMDB API when an API key is provided.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```

---

## 🔑 Optional: Live TMDB API Configuration
To connect live data from The Movie Database:
1. Create a free account at [themoviedb.org](https://www.themoviedb.org/).
2. Request a free Developer API key in **Settings → API**.
3. Create a `.env` file in the root folder:
   ```env
   VITE_TMDB_API_KEY=your_actual_tmdb_api_key_here
   ```
4. Restart the development server.
