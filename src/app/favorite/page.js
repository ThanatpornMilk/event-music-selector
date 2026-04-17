/**
 * Favorite Playlists Page
 * 
 * This page displays all user collections (liked playlists) and allows
 * for management such as rename, removing songs, or moving songs between collections.
 */

'use client'
import React, { useEffect, useState, useRef } from "react";
import { FaHeart, FaEdit, FaBookOpen, FaSearch, FaEllipsisH, FaMusic, FaTrash, FaExchangeAlt, FaChevronRight } from "react-icons/fa";
import SongCard from "@/components/song-card";
import EmptyState from "@/components/empty-state";
import ConfirmModal from "@/components/confirm-modal";
import PlaylistCover from "@/components/playlist-cover";
import { getPlaylists, updatePlaylistName, toggleLikePlaylist, removeSongFromPlaylist, addSongToPlaylist } from "@/actions/songs";

import { designSystem } from "@/config/design-system";

export default function FavoritePage() {
    const { colors, radius, shadows } = designSystem;
    const [likedPlaylists, setLikedPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [actionMenuVisible, setActionMenuVisible] = useState(null);
    const [targetPlaylist, setTargetPlaylist] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [unfavoriteTarget, setUnfavoriteTarget] = useState(null); // ID of the playlist pending unlike confirmation
    const actionMenuRef = useRef(null); // Detects clicks outside the menu to close it automatically

    const fetchFavoritePlaylists = async () => {
        setIsLoading(true);
        try {
            const data = await getPlaylists('liked'); // Fetch only liked playlists
            setLikedPlaylists(data);
        } catch (error) {
            console.error("Failed to fetch favorites:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFavoritePlaylists();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
                setActionMenuVisible(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleUnlikePlaylist = async () => {
        if (!unfavoriteTarget) return;
        await toggleLikePlaylist(unfavoriteTarget, false); // Pass false to unlike
        setUnfavoriteTarget(null); // Close the confirmation modal
        fetchFavoritePlaylists(); // Reload the list
        setSelectedPlaylist(null); // Close detail panel — the playlist no longer exists
    };

    const handleEditPlaylistName = async () => {
        if (selectedPlaylist !== null && newPlaylistName.trim() !== "") {
            const playlistId = likedPlaylists[selectedPlaylist].id;
            await updatePlaylistName(playlistId, newPlaylistName);
            await fetchFavoritePlaylists();
            setIsEditing(false);
        }
    };

    const handleRemoveSong = async (songId) => {
        const playlistId = likedPlaylists[selectedPlaylist].id;
        await removeSongFromPlaylist(playlistId, songId);
        fetchFavoritePlaylists();
    };

    const handleMoveSong = async (songIndex) => {
        if (targetPlaylist === null || selectedPlaylist === null) {
            alert("Please select a target playlist");
            return;
        }

        const songToMove = likedPlaylists[selectedPlaylist].songs[songIndex];
        const sourcePlaylistId = likedPlaylists[selectedPlaylist].id;
        const targetPlaylistId = likedPlaylists[targetPlaylist].id;

        try {
            // Remove from current
            await removeSongFromPlaylist(sourcePlaylistId, songToMove.id);
            // Add to target
            await addSongToPlaylist(targetPlaylistId, songToMove.id);

            fetchFavoritePlaylists();
        } catch (error) {
            console.error("Move failed:", error);
            alert("Failed to move song. Please try again.");
        }

        setTargetPlaylist(null);
        setActionMenuVisible(null);
    };

    const filteredPlaylists = likedPlaylists.filter((playlist) =>
        playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) // Case-insensitive search
    );

    // Resolve the selected playlist object — null if none selected (uses index, not id)
    const currentPlaylist = selectedPlaylist === null ? null : likedPlaylists[selectedPlaylist];

    return (
        <div className="text-black pt-6 sm:pt-10 px-4 sm:px-8 lg:px-20 flex flex-col lg:flex-row gap-8 min-h-screen" style={{ backgroundColor: colors.background.theme }}>

            {/* Sidebar - Hidden on mobile if a playlist is selected */}
            <div className={`w-full lg:w-1/3 bg-white p-8 rounded-3xl shadow-xl border-4 border-white h-fit sticky top-28 ${selectedPlaylist === null ? 'block' : 'hidden lg:block'}`}>
                <h2 className="text-2xl font-black mb-6 flex items-center" style={{ color: colors.primary.main }}>
                    <FaBookOpen className="mr-3 text-3xl" />
                    Favorite Playlists
                </h2>

                <div className="relative mb-6">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search your collections..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border-2 rounded-xl p-3 pl-12 outline-none focus:border-primary transition-all font-bold"
                        style={{ borderColor: colors.neutral[100] }}
                    />
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 text-black">
                    {(() => {
                        if (isLoading) return <div className="text-center py-10 font-black text-gray-300 animate-pulse">Loading...</div>;
                        if (filteredPlaylists.length === 0) return <EmptyState message="No collections found." icon={FaMusic} />;

                        return filteredPlaylists.map((playlist, index) => (
                            <button
                                key={playlist.id || `playlist-${index}`}
                                className={`w-full text-left flex items-center border-2 p-4 transition-all outline-none focus:ring-2 border-transparent hover:border-primary/50`}
                                style={{
                                    borderRadius: radius["2xl"],
                                    backgroundColor: selectedPlaylist === index ? colors.background.soft : colors.background.light,
                                    borderColor: selectedPlaylist === index ? colors.primary.main : undefined,
                                    boxShadow: selectedPlaylist === index ? shadows.md : "none",
                                    "--tw-ring-color": colors.primary.main
                                }}
                                onClick={() => {
                                    setSelectedPlaylist(index);
                                    setIsEditing(false);
                                }}
                            >
                                <PlaylistCover className="w-14 h-14 mr-6 shadow-sm" iconSize={24} />
                                <div className="flex-grow">
                                    <p className="font-black text-lg">{playlist.name}</p>
                                    <p className="text-gray-400 font-bold text-sm">{playlist.songs.length} songs</p>
                                </div>
                            </button>
                        ));
                    })()}
                </div>
            </div>

            {/* Playlist Detail */}
            <div className={`w-full lg:w-2/3 ${selectedPlaylist === null ? 'hidden lg:block' : 'block'}`}>
                {currentPlaylist ? (
                    <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-white animate-in slide-in-from-right duration-500 text-black">
                        {/* Mobile Back Button */}
                        {/* Mobile Controls Row */}
                        <div className="lg:hidden flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                            <button 
                                onClick={() => setSelectedPlaylist(null)}
                                className="flex items-center text-primary font-black gap-2 hover:translate-x-[-4px] transition-transform"
                            >
                                <FaChevronRight className="rotate-180" />
                                Back to Collections
                            </button>

                            <button
                                onClick={() => setUnfavoriteTarget(currentPlaylist.id)}
                                className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-sm border-2 border-white"
                            >
                                <FaHeart size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col items-center md:items-start md:flex-row justify-between mb-8 pb-8 border-b-2 border-gray-50 gap-8">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 w-full">
                                <PlaylistCover className="w-32 h-32 md:w-24 md:h-24 shadow-md shrink-0 mb-4 md:mb-0 mx-auto md:mx-0" iconSize={40} />
                                <div className="text-center md:text-left flex-grow w-full">
                                    {isEditing ? (
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                className="w-full border-2 border-primary rounded-xl p-3 font-black text-xl outline-none"
                                                value={newPlaylistName}
                                                onChange={(e) => setNewPlaylistName(e.target.value)}
                                                autoFocus
                                            />
                                            <div className="flex gap-3 justify-center md:justify-start">
                                                <button
                                                    onClick={handleEditPlaylistName}
                                                    className="bg-primary text-white px-6 py-2 rounded-xl font-black shadow-md hover:bg-primary-dark"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="bg-gray-100 text-gray-500 px-6 py-2 rounded-xl font-black hover:bg-gray-200"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full">
                                            <div className="flex items-center justify-center md:justify-start gap-2">
                                                <h2 className="text-3xl sm:text-4xl font-black text-black">
                                                    {currentPlaylist.name}
                                                </h2>
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(true);
                                                        setNewPlaylistName(currentPlaylist.name);
                                                    }}
                                                    className="p-2 text-gray-300 hover:text-primary transition-colors shrink-0"
                                                >
                                                    <FaEdit size={18} />
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-gray-400 font-bold">
                                                <p>🎵 {currentPlaylist.songs.length} Tracks</p>
                                                <p>🕒 {currentPlaylist.totalHours.toString().padStart(2, '0')}:
                                                    {currentPlaylist.totalMinutes.toString().padStart(2, '0')}:
                                                    {currentPlaylist.totalSeconds.toString().padStart(2, '0')}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Desktop Heart Button */}
                            <button
                                onClick={() => setUnfavoriteTarget(currentPlaylist.id)}
                                className="hidden lg:flex p-4 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            >
                                <FaHeart size={24} />
                            </button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-4">
                            {currentPlaylist.songs.map((song, songIndex) => (
                                <SongCard
                                    key={song.id || songIndex}
                                    song={song}
                                    actions={
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActionMenuVisible(actionMenuVisible === songIndex ? null : songIndex);
                                                    setTargetPlaylist(null);
                                                }}
                                                className="p-2 text-gray-300 hover:text-primary transition-all rounded-full hover:bg-primary/5 active:scale-90"
                                            >
                                                <FaEllipsisH size={20} />
                                            </button>

                                            {actionMenuVisible === songIndex && (
                                                <div
                                                    ref={actionMenuRef}
                                                    className="absolute top-full right-0 mt-2 w-48 sm:w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[60] p-4 animate-in fade-in zoom-in slide-in-from-top-2 duration-200 text-black overflow-hidden"
                                                >
                                                    <div className="flex items-center gap-2 mb-3 px-1 text-primary/70">
                                                        <FaExchangeAlt size={12} />
                                                        <p className="text-[10px] font-black uppercase tracking-wider">Move Collection</p>
                                                    </div>

                                                    <div className="space-y-2 mb-4">
                                                        <select
                                                            value={targetPlaylist ?? ""}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setTargetPlaylist(val === "" ? null : Number(val));
                                                            }}
                                                            className="w-full p-2 border border-gray-100 rounded-xl outline-none focus:border-primary/30 font-bold text-xs bg-gray-50/50 hover:bg-white transition-all appearance-none cursor-pointer"
                                                        >
                                                            <option value="">Select collection...</option>
                                                            {likedPlaylists.map((p, i) =>
                                                                i === selectedPlaylist ? null : (
                                                                    <option key={p.id || `target-${i}`} value={i}>
                                                                        {p.name}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>

                                                        {targetPlaylist !== null && (
                                                            <button
                                                                onClick={() => handleMoveSong(songIndex)}
                                                                className="w-full py-2 bg-primary text-white rounded-xl font-black text-xs hover:bg-primary-dark transition-all shadow-md flex items-center justify-center gap-2"
                                                            >
                                                                Confirm Move
                                                                <FaChevronRight size={10} />
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="pt-2 border-t border-gray-50">
                                                        <button
                                                            onClick={() => handleRemoveSong(song.id)}
                                                            className="w-full py-2 flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl font-black text-xs transition-all"
                                                        >
                                                            <FaTrash size={12} />
                                                            Remove from here
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    }
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-white/30 rounded-3xl border-4 border-white border-dashed p-10">
                        <FaHeart className="text-6xl text-white/50 mb-4" />
                        <p className="text-2xl font-black text-white">Select a playlist to view details</p>
                    </div>
                )}
            </div>

            {/* Unfavorite Confirmation Modal */}
            <ConfirmModal
                isOpen={!!unfavoriteTarget}
                onClose={() => setUnfavoriteTarget(null)}
                onConfirm={handleUnlikePlaylist}
                title="Remove from favorites?"
                message={<>Are you sure you want to remove this playlist?<br />This action cannot be undone.</>}
            />
        </div>
    );
}
