/**
 * Favorite Collection Modal
 * 
 * A specialized modal for naming or renaming user collections.
 * Features a clean input field and prominent action buttons.
 */

'use client'
import React, { useState, useEffect, useRef } from "react";
import { FaHeart } from "react-icons/fa";

export default function FavoriteModal({
    isOpen,
    onClose,
    onConfirm,
    initialName = ""
}) {
    const [tempName, setTempName] = useState(initialName);
    const nameInputRef = useRef(null);

    // Sync the input value with the initial name whenever the modal opens
    useEffect(() => {
        if (isOpen) {
            setTempName(initialName);
            setTimeout(() => nameInputRef.current?.focus(), 100);
        }
    }, [isOpen, initialName]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
            <div className="bg-bg-modal p-8 w-full max-w-sm border-4 border-white animate-in zoom-in-95 duration-200 relative overflow-hidden rounded-4xl">
                {/* Decoration */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-bg-theme rounded-full opacity-20 blur-xl"></div>

                {/* Content — icon + title + subtitle */}
                <div className="relative z-10 text-center mb-6">
                    <div className="inline-block p-3 bg-white rounded-2xl shadow-sm mb-3">
                        <FaHeart className="text-4xl text-primary" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-800">Save to Favorite</h2>
                    <p className="text-gray-600 font-bold mt-1 text-sm">Please enter a name for your playlist</p>
                </div>

                {/* Footer — Name input + Cancel/Save actions */}
                <div className="relative z-10 space-y-5">
                    <input
                        ref={nameInputRef}
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onConfirm(tempName)}
                        placeholder="e.g. My Wedding..."
                        className="w-full h-[50px] px-5 border-2 border-bg-theme focus:border-primary rounded-xl font-bold text-lg outline-none transition-all shadow-inner bg-white"
                    />

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-xl font-black hover:bg-gray-200 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onConfirm(tempName)}
                            className="flex-1 py-3 bg-primary text-white rounded-xl font-black hover:bg-primary-dark transition-all shadow-md active:scale-95"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
