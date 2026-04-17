/**
 * PlaylistCard Component
 * 
 * A visually rich card summarizing playlist details, including name, 
 * song count, total duration, and genres.
 */

import { FaHeart, FaRegHeart } from "react-icons/fa";
import PlaylistCover from "./playlist-cover";

export default function PlaylistCard({ playlist, isLiked, onLike, onClick }) {
    // Extract genres from the metadata JSON string
    const metadata = JSON.parse(playlist.metadata || '{}');
    const genres = metadata.genres || [];

    return (
        <div className="relative group">
            <button
                onClick={onClick}
                className="w-full text-left border-4 border-white p-6 rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all outline-none focus:ring-4 focus:ring-primary/20"
            >
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    <PlaylistCover className="w-24 h-24 flex-shrink-0" />

                    <div className="space-y-1 text-center sm:text-left">
                        <h2 className="text-xl sm:text-2xl font-black text-primary group-hover:underline">{playlist.name}</h2>
                        <p className="font-medium text-gray-600">Songs: {playlist.songs?.length || 0}</p>
                        <p className="font-medium text-gray-600">
                            Duration: {playlist.totalHours?.toString().padStart(2, '0') || "00"}:
                            {playlist.totalMinutes?.toString().padStart(2, '0') || "00"}:
                            {playlist.totalSeconds?.toString().padStart(2, '0') || "00"}
                        </p>
                        <p className="text-sm text-gray-400 truncate w-full max-w-[200px] mx-auto sm:mx-0">Genre: {genres.join(", ") || "Various"}</p>
                    </div>
                </div>
            </button>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onLike();
                }}
                className={`absolute top-6 right-6 text-3xl transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-full ${isLiked
                    ? "text-red-500"
                    : "text-gray-300 hover:text-gray-400"
                    }`}
            >
                {isLiked ? <FaHeart /> : <FaRegHeart />}
            </button>
        </div>
    );
}
