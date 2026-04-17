/**
 * Recommended Themes Component
 * 
 * Displays a list of curated themes with unique imagery. 
 * Allows users to explore random collections of songs related to each theme.
 */

'use client'
import React, { useEffect, useState } from "react";
import { getSongs } from "@/actions/songs";
import ThemeCard from "./theme-card";
import SongModal from "./song-modal";

const themeImages = {
  "Wedding": "/image/wedding.jpg",
  "Night party": "/image/night-party.jpg",
  "Birthday party": "/image/birthday-party.jpg",
  "Buddhist": "/image/buddhist.jpg",
  "Christian": "/image/christian.jpg",
  "Funeral": "/image/funeral.jpg",
  "Luxury": "/image/luxury.jpg",
  "Graduation party": "/image/graduation-party.jpg",
  "Christmas party": "/image/christmas.jpg",
  "Chinese New Year": "/image/chinese-new-year.jpg",
  "Halloween party": "/image/halloween.jpg",
};

// Map database theme names (Thai) to English UI labels
const themeNameMap = {
  "งานแต่งงาน": "Wedding",
  "งานปาร์ตี้": "Night party",
  "งานเลี้ยง": "Birthday party",
  "งานทางศาสนาพุทธ": "Buddhist",
  "งานทางศาสนาคริสต์": "Christian",
  "งานศพ": "Funeral",
  "งานหรูหรา": "Luxury",
  "งานจบการศึกษา": "Graduation party",
  "งานคริสต์มาส": "Christmas party",
  "งานตรุษจีน": "Chinese New Year",
  "งานฮาโลวีน": "Halloween party"
};

const formatDuration = (durationInSeconds) => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

function Reccom() {
  const [groupedByTheme, setGroupedByTheme] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnglishTheme, setSelectedEnglishTheme] = useState(null);
  const [randomSongs, setRandomSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const groupSongsByTheme = (songs) => {
    return songs.reduce((acc, song) => {
      song.themes.forEach((themeObj) => {
        const engName = themeNameMap[themeObj.name] || themeObj.name;
        if (!acc[engName]) acc[engName] = [];
        acc[engName].push(song);
      });
      return acc;
    }, {});
  };

  useEffect(() => {
    getSongs().then((songs) => {
      const themes = groupSongsByTheme(songs);
      setGroupedByTheme(themes);
      setLoading(false);
    });
  }, []);

  const openModal = (engTheme) => {
    setSelectedEnglishTheme(engTheme);
    const selectedThemeSongs = groupedByTheme[engTheme] || [];
    setRandomSongs(getRandomSongs(selectedThemeSongs, 10, 15));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEnglishTheme(null);
    setRandomSongs([]);
  };

  const getRandomSongs = (songsList, min = 10, max = 15) => {
    if (!songsList || songsList.length === 0) return [];
    const numberOfSongs = Math.floor(Math.random() * (Math.min(songsList.length, max) - min + 1)) + min;
    const shuffledSongs = [...songsList].sort(() => Math.random() - 0.5);
    return shuffledSongs.slice(0, numberOfSongs);
  };

  const totalDuration = randomSongs.reduce((acc, song) => acc + (song.rawDuration || 0), 0);

  return (
    <div className="bg-[#F7D7D1] p-4 sm:p-6 md:p-8 pt-0 border-none">
      <h1 className="text-black text-2xl sm:text-3xl font-bold mb-5 pt-10">Recommended</h1>

      {loading ? (
        <div className="text-black text-center py-10 font-bold animate-pulse">Loading data...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative">
          {Object.keys(themeImages).filter(engTheme => groupedByTheme[engTheme]).map((engTheme) => (
            <ThemeCard
              key={engTheme}
              theme={engTheme}
              image={themeImages[engTheme]}
              onClick={() => openModal(engTheme)}
            />
          ))}
        </div>
      )}

      <SongModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedEnglishTheme}
        image={themeImages[selectedEnglishTheme]}
        details={[
           `Total Duration: ${formatDuration(totalDuration)}`,
           `Total Songs: ${randomSongs.length}`
        ]}
        songs={randomSongs}
        variant="grid"
      />
    </div>
  );
}

export default Reccom;
