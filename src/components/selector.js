/**
 * Song Selector Component
 * 
 * The main engine for filtering songs and generating playlists based on 
 * user-selected themes, genres, and languages.
 */

'use client'
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getSongs, savePlaylist, deletePlaylist, getPlaylists } from "@/actions/songs";
import FormField from "./form-field";
import MultiSelectDropdown from "./multi-select-dropdown";

export default function Selector() {
  const router = useRouter();

  const themes = ["Select", "Wedding", "Night party", "Birthday party", "Buddhist", "Christian", "Funeral", "Luxury", "Graduation party", "Christmas party", "Chinese New Year", "Halloween party"];
  const genreOptions = ["Pop", "Jazz", "EDM", "Lo-Fi", "Classical", "Rock", "Romantic", "Retro", "Hip-Hop", "ลูกทุ่ง", "ลูกกรุง", "เพื่อชีวิต", "Indie", "Country", "Alternative", "Rap", "R&B", "Chanson", "Opera", "Tango", "Bolero", "Swing", "Bossa Nova", "Soul", "Worship", "Hymn", "Carol", "Disco", "Traditional", "Soundtrack", "Metal"];
  const languageOptions = ["English", "Thai", "Spanish", "French", "German", "Japanese", "Chinese", "Korean", "Instrumental", "ETC."];

  const [allSongs, setAllSongs] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: "",
    themes: "Select",
  });
  const [message, setMessage] = useState("");
  const genreDropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);

  useEffect(() => {
    getSongs().then(setAllSongs);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(e.target)) {
        setGenreDropdownOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(e.target)) {
        setLanguageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleGenre = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const toggleLanguage = (lang) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Remove old playlists that have not been liked before generating new ones
  // Prevents stale data from accumulating in the database
  const clearUnlikedPlaylists = async () => {
    const old = await getPlaylists(false);
    for (const p of old.filter(p => !p.isLiked)) {
      await deletePlaylist(p.id);
    }
  };

  const generateNewPlaylists = async (filteredData) => {
    setMessage("Creating your playlists...");
    await clearUnlikedPlaylists();

    for (let i = 0; i < 5; i++) {
      let totalSeconds = 0;
      const availableSongs = shuffleArray([...filteredData]);
      const minSongs = 5;
      const maxSongs = Math.min(filteredData.length, 80); // Cap at 80 songs per playlist
      const numSongs = Math.floor(Math.random() * (maxSongs - minSongs + 1)) + minSongs; // Random count between 5–80
      
      const playlistSongs = availableSongs.slice(0, numSongs);
      playlistSongs.forEach(s => {
        totalSeconds += (s.rawDuration || 240);
      });

      await savePlaylist({
        name: `Play ${i + 1}`,
        songs: playlistSongs,
        totalDuration: {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        },
        metadata: { genres: [...new Set(playlistSongs.flatMap(s => s.genres.map(g => g.name)))] }
      });
    }

    // Flag to tell /playlist that data is ready — prevents redirect loop
    sessionStorage.setItem("playlistReady", "true");
    router.push("/playlist");
  };

  const createPlaylists = () => {
    setMessage("");

    if (filters.themes === "Select" || selectedGenres.length === 0 || selectedLanguages.length === 0) {
      setMessage("Please select Theme, Music Genres, and Language.");
      return;
    }

    // Filter songs using all criteria simultaneously (AND logic — must satisfy every condition)
    const filteredData = allSongs.filter((song) => {
      const searchTerm = filters.searchTerm?.toLowerCase() || "";
      const matchesSearch = searchTerm === "" || song.artist.toLowerCase().includes(searchTerm);
      const matchesLang = selectedLanguages.length === 0 || selectedLanguages.includes(song.language);
      const matchesTheme = filters.themes === "Select" || song.themes.some(t => t.name === filters.themes); // Matches theme name stored in the database
      const matchesGenre = selectedGenres.length === 0 || song.genres.some(g => selectedGenres.includes(g.name));
      return matchesSearch && matchesLang && matchesTheme && matchesGenre;
    });

    if (filteredData.length === 0) {
      setMessage("Could not create a playlist that matches the criteria.");
      return;
    }

    generateNewPlaylists(filteredData);
  };

  const handleCancel = () => {
    setFilters({ searchTerm: "", themes: "Select" });
    setSelectedGenres([]);
    setSelectedLanguages([]);
  };

  return (
    <div id="selector-section" className="w-full bg-bg-theme min-h-screen p-4 sm:p-10 lg:p-20 flex justify-center items-center overflow-x-hidden">
      <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-6">

        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <img src="/image/CD.jpeg" alt="CD" className="w-full max-w-md h-auto object-cover rounded-lg shadow-xl" />
        </div>

        <div className="w-full lg:w-1/2 bg-white/30 p-8 rounded-2xl backdrop-blur-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <FormField
              label="Theme"
              value={filters.themes}
              onChange={(value) => setFilters({ ...filters, themes: value })}
              options={themes}
            />

            <MultiSelectDropdown
              label="Music Genres"
              options={genreOptions}
              selected={selectedGenres}
              onToggle={toggleGenre}
              isOpen={genreDropdownOpen}
              setIsOpen={setGenreDropdownOpen}
              dropdownRef={genreDropdownRef}
              placeholder="Select genres..."
            />

            <MultiSelectDropdown
              label="Language"
              options={languageOptions}
              selected={selectedLanguages}
              onToggle={toggleLanguage}
              isOpen={languageDropdownOpen}
              setIsOpen={setLanguageDropdownOpen}
              dropdownRef={languageDropdownRef}
              placeholder="Select languages..."
              fullWidth={true}
            />

            <FormField
              label="Artist Name"
              type="text"
              placeholder="Search by artist name (optional)"
              value={filters.searchTerm}
              onChange={(value) => setFilters({ ...filters, searchTerm: value })}
              className="sm:col-span-2"
            />

            <div className="flex justify-end space-x-4 sm:col-span-2 mt-4">
              <button
                onClick={handleCancel}
                className="bg-[#FFB2BD] text-primary text-base py-2 px-8 rounded-md font-bold hover:bg-[#ff9eac] transition-all"
              >
                Cancel
              </button>
              <button
                className="bg-primary text-white text-base py-2 px-8 rounded-md font-bold hover:bg-primary-dark transition-all active:scale-95 shadow-lg"
                onClick={createPlaylists}
              >
                Done
              </button>
            </div>

            {message && (
              <div className={`font-bold text-center sm:col-span-2 animate-pulse mt-4 ${message.startsWith("Creating") ? "text-primary" : "text-red-600"}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
