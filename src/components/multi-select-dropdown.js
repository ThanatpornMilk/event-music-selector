/**
 * Multi-Select Dropdown Component
 * 
 * A reusable UI component that allows users to select multiple options 
 * from a list, featuring search and checkbox interaction.
 */

import { designSystem } from "@/config/design-system";

/**
 * A reusable multi-select dropdown component.
 * Follows the DRY principle by consolidating shared dropdown logic.
 */
export default function MultiSelectDropdown({ 
  label, 
  options, 
  selected, 
  onToggle, 
  isOpen, 
  setIsOpen, 
  dropdownRef,
  placeholder = "Select options...",
  fullWidth = false
}) {
  const { colors } = designSystem;

  return (
    <div className={`relative ${fullWidth ? "sm:col-span-2" : ""}`} ref={dropdownRef}>
      <label className="block mb-2 text-black font-semibold text-xl">{label}</label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className="w-full h-[45px] p-3 border border-gray-200 rounded-md text-black text-base bg-white focus:ring-2 outline-none transition-all text-left flex justify-between items-center cursor-pointer"
        style={{ "--tw-ring-color": colors.primary.main }}
      >
        <div className="flex-grow overflow-hidden pr-2">
          <div className="flex flex-wrap gap-2 items-center">
            {selected.length === 0 ? (
              <span className="text-gray-400">{placeholder}</span>
            ) : (
              selected.map(item => (
                <span 
                  key={item} 
                  className="text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0"
                  style={{ backgroundColor: colors.primary.main }}
                >
                  {item}
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle(item);
                    }}
                    className="hover:bg-white/20 rounded-full px-1 cursor-pointer outline-none focus:ring-1 focus:ring-white"
                  >
                    <span className="ml-1 opacity-70">{"✕"}</span>
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
        <span className="text-gray-400 text-[10px] flex-shrink-0">{"▼"}</span>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-xl max-h-80 overflow-y-auto">
          {options.map((option) => {
            const checked = selected.includes(option);
            return (
              <label
                key={option}
                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors hover:bg-gray-500 hover:text-white group"
                style={{ backgroundColor: checked ? colors.background.soft : "" }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(option)}
                  className="w-4 h-4 cursor-pointer"
                  style={{ accentColor: colors.primary.main }}
                />
                <span 
                  className="text-sm font-semibold"
                  style={{ color: checked ? colors.primary.main : colors.neutral[800] }}
                >{option}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
