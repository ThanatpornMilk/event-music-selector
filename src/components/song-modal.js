/**
 * Song Modal Component
 * 
 * A high-level modal that displays detailed information about a playlist 
 * or a song, designed for immersion and clarity.
 */

'use client'
import React from "react";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import SongCard from "./song-card";
import PlaylistCover from "./playlist-cover";

if (globalThis.window !== undefined) {
    Modal.setAppElement('body');
}

export default function SongModal({ 
    isOpen, 
    onClose, 
    title, 
    image, 
    details, 
    songs = [], 
    variant = "grid",
    extraHeader = null 
}) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel={title}
            style={{
                overlay: { 
                    backgroundColor: "rgba(0, 0, 0, 0.7)", 
                    zIndex: 1000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "16px"
                },
                content: {
                    position: "relative",
                    inset: "auto",
                    width: "100%",
                    maxWidth: "800px",
                    maxHeight: "90vh",
                    padding: "24px",
                    borderRadius: "24px",
                    backgroundColor: "#fff",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    overflowY: "auto",
                    color: "black",
                    border: "none"
                },
            }}
        >
            {/* Header — Close button + extra actions (e.g. heart button) */}
            <div className="flex justify-between items-center mb-4">
                {extraHeader}
                <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors ml-auto">
                    <FaTimes size={24} />
                </button>
            </div>

            {/* Content — Playlist cover + title + details */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-gray-100">
                <div className={`w-full md:w-48 h-48 flex-shrink-0 overflow-hidden shadow-lg border-4 border-white ${image ? "rounded-2xl" : "rounded-full"}`}>
                    {image ? (
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <PlaylistCover className="w-full h-full" iconSize={80} />
                    )}
                </div>
                <div className="text-center md:text-left space-y-2 overflow-hidden">
                    <h2 className="text-2xl sm:text-4xl font-black text-black truncate">{title}</h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-500 font-bold">
                        {details.map((detail, idx) => (
                            <p key={`detail-${idx}`}>{detail}</p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Song List */}
            <div className="space-y-4">
                {songs.map((song) => (
                    <SongCard key={song.id} song={song} variant={variant} />
                ))}
            </div>
        </Modal>
    );
}
