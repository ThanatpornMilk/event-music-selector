'use client'
/**
 * EmptyState Component
 * 
 * A reusable UI component for displaying "no data" states with 
 * a consistent style, custom messages, and descriptive icons.
 */

import React from "react";
import { FaMusic } from "react-icons/fa";

export default function EmptyState({ message = "No data found.", icon: Icon = FaMusic }) {
    return (
        <div className="flex flex-col items-center justify-center p-10 text-center w-full min-h-[200px]">
            <Icon className="text-6xl text-gray-300 mb-4 animate-pulse" />
            <p className="text-xl font-bold text-gray-400">{message}</p>
        </div>
    );
}
