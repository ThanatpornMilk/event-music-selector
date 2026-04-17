/**
 * SongCard Component
 * 
 * A specialized card for displaying individual song details with support for
 * YouTube previews, social sharing, and collection-specific actions.
 */

'use client'
import React from "react";
import { FaPlay, FaMusic } from "react-icons/fa";

const formatDuration = (durationInSeconds) => {
    if (!durationInSeconds || durationInSeconds === 0) return "--:--";
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match?.[2]?.length === 11 ? match[2] : null; // YouTube IDs are always exactly 11 characters
};

export default function SongCard({ song, variant = "list", actions = null }) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    
    const videoId = getYoutubeId(song.url || song.youtubeId); // Supports both field names
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
    const thumbUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null; // Load thumbnail first; iframe loads only on play

    const renderPreview = (height = "h-full") => {
        if (!videoId) {
            return <div className={`w-full ${height} flex flex-col items-center justify-center bg-gray-900 text-gray-400 gap-2`}>
                <FaMusic />
                <span className="text-xs italic">No Preview</span>
            </div>;
        }

        if (isPlaying) {
            return (
                <iframe
                    src={embedUrl}
                    className={`w-full ${height} border-0`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={song.title}
                ></iframe>
            );
        }

        return (
            <button 
                type="button"
                className={`relative w-full ${height} cursor-pointer group/thumb outline-none focus:ring-2 focus:ring-primary/20 overflow-hidden`}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsPlaying(true);
                }}
            >
                <img src={thumbUrl} alt={song.title} className="w-full h-full object-cover brightness-90 group-hover/thumb:brightness-110 transition-all" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transition-transform group-hover/thumb:scale-110">
                        <FaPlay className="ml-1" />
                    </div>
                </div>
            </button>
        );
    };

    if (variant === "grid") {
        return (
            <div className="p-4 bg-gray-100 rounded-lg shadow-md flex flex-col lg:flex-row items-center lg:items-start text-black">
                <div className="w-full lg:w-1/2 overflow-hidden rounded-xl">
                    {renderPreview("h-[200px]")}
                </div>

                <div className="w-full lg:w-1/2 pl-0 lg:pl-4 mt-4 lg:mt-0 flex flex-col justify-between text-black">
                    <div className="text-lg font-semibold flex justify-between items-center text-black">
                        <strong className="truncate mr-2">{song.title || song.songName}</strong>
                        <span className="text-sm text-gray-600 flex-shrink-0">{formatDuration(song.rawDuration)}</span>
                    </div>
                    <div className="text-sm text-gray-500">{song.artist}</div>
                </div>
            </div>
        );
    }

    return (
        <li className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50 p-6 rounded-2xl border-2 border-transparent hover:border-primary hover:bg-white transition-all shadow-sm group list-none">
            <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                <div className="w-full md:w-48 h-28 bg-black rounded-xl overflow-hidden shadow-md flex-shrink-0">
                    {renderPreview("h-full")}
                </div>
                <div className="flex-grow text-center md:text-left overflow-hidden">
                    <p className="text-xl font-black text-black truncate">{song.title}</p>
                    <p className="text-lg text-gray-500 font-bold truncate">{song.artist}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-xl font-black text-primary bg-bg-soft px-4 py-2 rounded-lg whitespace-nowrap">
                    {formatDuration(song.rawDuration)}
                </div>
                {actions}
            </div>
        </li>
    );
}
