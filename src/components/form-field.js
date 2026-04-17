'use client'
/**
 * Form Field Component
 * 
 * A reusable input component supporting both text inputs and 
 * select dropdowns with consistent styling and accessibility.
 */

import React from "react";

export default function FormField({ 
    label, 
    value, 
    onChange, 
    type = "select", 
    options = [], 
    placeholder = "", 
    className = "" 
}) {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);

    // ปรับสไตล์พื้นฐาน
    const baseStyles = "w-full h-[45px] p-3 border border-gray-200 rounded-md text-black text-base bg-white focus:ring-2 focus:ring-primary outline-none transition-all flex items-center justify-between";

    // ปิด Dropdown เมื่อคลิกข้างนอก
    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`w-full ${className}`} ref={dropdownRef}>
            <label className="block mb-2 text-black font-semibold text-xl">{label}</label>
            
            {type === "select" ? (
                <div className="relative w-full">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className={`${baseStyles} cursor-pointer pr-10 ${isOpen ? 'ring-2 ring-primary' : ''}`}
                    >
                        <span className={value === "Select" ? "text-gray-400" : "text-black"}>
                            {value}
                        </span>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[10px]">
                            ▼
                        </div>
                    </button>

                    {isOpen && (
                        <div className="absolute top-full left-0 w-full bg-white border border-gray-100 mt-1 rounded-xl shadow-2xl z-[100] max-h-60 overflow-y-auto py-2 animate-in fade-in zoom-in-95 duration-200">
                            {options.map((option, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                        onChange(option);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-5 py-3 text-sm font-bold hover:bg-primary/5 transition-colors ${value === option ? 'text-primary bg-primary/5' : 'text-gray-700'}`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <input
                    type={type}
                    className={baseStyles}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
        </div>
    );
}
