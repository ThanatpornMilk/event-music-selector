/**
 * ThemeCard Component
 * 
 * An interactive card used for selecting or viewing specific 
 * event themes with high-quality background images.
 */

'use client'
import React from "react";

export default function ThemeCard({ theme, image, onClick }) {
    return (
        <button
            onClick={onClick}
            className="bg-white border border-gray-300 rounded-lg p-4 w-full h-96 flex flex-col justify-between relative shadow-sm hover:shadow-md transition-shadow group outline-none focus:ring-2 focus:ring-primary/50 text-left"
        >
            <div className="overflow-hidden rounded-md h-72 w-full">
                <img
                    src={image || "/image/default.jpg"}
                    alt={theme}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
            </div>
            <h3 className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-xl text-black font-semibold text-center w-full px-2">
                {theme}
            </h3>
        </button>
    );
}
