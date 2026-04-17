/**
 * Playlist Cover Component
 * 
 * Generates an artistic cover for playlists by creating a composite
 * of multiple song thumbnails, representing the collection's diversity.
 */

import { designSystem } from "@/config/design-system";
import { FaMusic } from "react-icons/fa";

export default function PlaylistCover({ className = "w-20 h-20", iconSize = 32 }) {
    const { colors } = designSystem;
    
    return (
        <div 
            className={`${className} rounded-full flex-shrink-0 flex items-center justify-center text-white shadow-lg border-2 border-white overflow-hidden`}
            style={{ 
                background: `linear-gradient(to bottom right, ${colors.primary.main}, ${colors.primary.light})`,
            }}
        >
            <FaMusic size={iconSize} />
        </div>
    );
}
