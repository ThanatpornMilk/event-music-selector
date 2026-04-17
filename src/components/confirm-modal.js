/**
 * Confirmation Modal Component
 * 
 * A reusable modal for critical user actions that require 
 * explicit confirmation, featuring a clear warning aesthetic.
 */

import { designSystem } from "@/config/design-system";
import { FaExclamationTriangle } from "react-icons/fa";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;
    const { colors, radius } = designSystem;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
            <div 
                className="bg-[#fffcfc] shadow-2xl p-8 w-full max-w-[520px] border-4 border-white animate-in zoom-in-95 duration-200 relative overflow-hidden text-center"
                style={{ borderRadius: radius["4xl"] }}
            >
                {/* Decoration */}
                <div 
                    className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-xl"
                    style={{ backgroundColor: colors.background.theme }}
                ></div>

                {/* Content — icon + title + message */}
                <div className="relative z-10 mb-6">
                    <div className="inline-block p-4 bg-white rounded-2xl shadow-sm mb-4">
                        <FaExclamationTriangle className="text-4xl" style={{ color: colors.primary.main }} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-800">{title}</h2>
                    <p className="text-gray-600 font-bold mt-2 text-sm px-4">{message}</p>
                </div>

                {/* Footer — Cancel + Confirm actions */}
                <div className="relative z-10 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-xl font-black hover:bg-gray-200 transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 text-white rounded-xl font-black transition-all shadow-md active:scale-95 shadow-red-100"
                        style={{ backgroundColor: colors.primary.main }}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
