/**
 * Top Header Component
 * 
 * The main hero section of the home page, featuring the project branding, 
 * descriptive text, and a call-to-action to begin song selection.
 */

'use client'
import React from "react";

export default function Top() {
  return (
    <div
      className="h-screen bg-cover bg-center relative flex flex-col"
      style={{ backgroundImage: "url('/image/background.png')" }}
    >
      <div className="flex flex-col h-full justify-center items-end lg:pr-40 px-6 md:px-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black leading-relaxed text-center lg:text-right w-full lg:w-auto">
          🎵 "Easily create playlists that
          <br className="hidden sm:block" />
          match your theme!"
        </h1>

        <p className="text-base sm:text-lg text-black max-w-md leading-relaxed mt-6 lg:mt-8 text-center lg:text-right w-full lg:w-auto">
          Select your theme, pick the mood, and build a playlist
          <br className="hidden sm:block" />
          that fits your event in just a few clicks! 🎶
        </p>

        <div className="mt-8 lg:mt-10 w-full flex justify-center lg:justify-end">
          <button
            onClick={() => document.getElementById('selector-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-red-600 hover:bg-red-700 text-white text-lg py-2 px-10 rounded-md shadow-lg transition-all active:scale-95"
          >
            Let's Start
          </button>
        </div>
      </div>
    </div>
  );
}
