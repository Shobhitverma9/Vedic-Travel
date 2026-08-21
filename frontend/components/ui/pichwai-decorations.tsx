import React from "react"

interface PichwaiDecorationProps {
    className?: string
}

export function LotusDecoration({ className = "" }: PichwaiDecorationProps) {
    return (
        <svg
            className={className}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Lotus flower with traditional Pichwai style */}
            <g opacity="0.15">
                {/* Center circle */}
                <circle cx="100" cy="100" r="15" fill="#FF9933" />

                {/* Inner petals */}
                <ellipse cx="100" cy="75" rx="12" ry="30" fill="#FF6B35" />
                <ellipse cx="125" cy="87.5" rx="12" ry="30" fill="#FF6B35" transform="rotate(45 100 100)" />
                <ellipse cx="125" cy="112.5" rx="12" ry="30" fill="#FF6B35" transform="rotate(90 100 100)" />
                <ellipse cx="112.5" cy="125" rx="12" ry="30" fill="#FF6B35" transform="rotate(135 100 100)" />
                <ellipse cx="100" cy="125" rx="12" ry="30" fill="#FF6B35" transform="rotate(180 100 100)" />
                <ellipse cx="87.5" cy="125" rx="12" ry="30" fill="#FF6B35" transform="rotate(225 100 100)" />
                <ellipse cx="75" cy="112.5" rx="12" ry="30" fill="#FF6B35" transform="rotate(270 100 100)" />
                <ellipse cx="75" cy="87.5" rx="12" ry="30" fill="#FF6B35" transform="rotate(315 100 100)" />

                {/* Outer petals */}
                <ellipse cx="100" cy="55" rx="15" ry="40" fill="#FFA07A" opacity="0.8" />
                <ellipse cx="135" cy="75" rx="15" ry="40" fill="#FFA07A" opacity="0.8" transform="rotate(45 100 100)" />
                <ellipse cx="145" cy="100" rx="15" ry="40" fill="#FFA07A" opacity="0.8" transform="rotate(90 100 100)" />
                <ellipse cx="135" cy="125" rx="15" ry="40" fill="#FFA07A" opacity="0.8" transform="rotate(135 100 100)" />
                <ellipse cx="100" cy="145" rx="15" ry="40" fill="#FFA07A" opacity="0.8" transform="rotate(180 100 100)" />
                <ellipse cx="65" cy="125" rx="15" ry="40" fill="#FFA07A" opacity="0.8" transform="rotate(225 100 100)" />
                <ellipse cx="55" cy="100" rx="15" ry="40" fill="#FFA07A" opacity="0.8" transform="rotate(270 100 100)" />
                <ellipse cx="65" cy="75" rx="15" ry="40" fill="#FFA07A" opacity="0.8" transform="rotate(315 100 100)" />

                {/* Decorative dots */}
                <circle cx="100" cy="40" r="3" fill="#FF9933" />
                <circle cx="140" cy="60" r="3" fill="#FF9933" />
                <circle cx="160" cy="100" r="3" fill="#FF9933" />
                <circle cx="140" cy="140" r="3" fill="#FF9933" />
                <circle cx="100" cy="160" r="3" fill="#FF9933" />
                <circle cx="60" cy="140" r="3" fill="#FF9933" />
                <circle cx="40" cy="100" r="3" fill="#FF9933" />
                <circle cx="60" cy="60" r="3" fill="#FF9933" />
            </g>
        </svg>
    )
}

export function CowDecoration({ className = "" }: PichwaiDecorationProps) {
    return (
        <svg
            className={className}
            viewBox="0 0 200 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Stylized cow silhouette with Pichwai aesthetic */}
            <g opacity="0.12">
                {/* Body */}
                <ellipse cx="100" cy="80" rx="60" ry="40" fill="#6B4423" />

                {/* Head */}
                <ellipse cx="50" cy="65" rx="25" ry="30" fill="#8B6F47" />

                {/* Ears */}
                <ellipse cx="40" cy="50" rx="8" ry="15" fill="#6B4423" transform="rotate(-20 40 50)" />
                <ellipse cx="60" cy="50" rx="8" ry="15" fill="#6B4423" transform="rotate(20 60 50)" />

                {/* Horns */}
                <path d="M 35 45 Q 30 35 25 30" stroke="#8B4513" strokeWidth="3" fill="none" />
                <path d="M 65 45 Q 70 35 75 30" stroke="#8B4513" strokeWidth="3" fill="none" />

                {/* Legs */}
                <rect x="65" y="110" width="10" height="30" fill="#6B4423" rx="5" />
                <rect x="85" y="110" width="10" height="30" fill="#6B4423" rx="5" />
                <rect x="105" y="110" width="10" height="30" fill="#6B4423" rx="5" />
                <rect x="125" y="110" width="10" height="30" fill="#6B4423" rx="5" />

                {/* Tail */}
                <path d="M 155 75 Q 170 70 175 85" stroke="#6B4423" strokeWidth="4" fill="none" strokeLinecap="round" />

                {/* Decorative patterns on body */}
                <circle cx="90" cy="75" r="4" fill="#FFD700" opacity="0.6" />
                <circle cx="110" cy="80" r="4" fill="#FFD700" opacity="0.6" />
                <circle cx="100" cy="90" r="4" fill="#FFD700" opacity="0.6" />

                {/* Traditional Pichwai decorative lines */}
                <path d="M 70 70 Q 80 65 90 70" stroke="#FFD700" strokeWidth="1.5" fill="none" opacity="0.5" />
                <path d="M 100 85 Q 110 80 120 85" stroke="#FFD700" strokeWidth="1.5" fill="none" opacity="0.5" />
            </g>
        </svg>
    )
}

export function PeacockFeatherDecoration({ className = "" }: PichwaiDecorationProps) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Peacock feather - Krishna's symbol */}
            <g opacity="0.15">
                {/* Feather eye */}
                <ellipse cx="50" cy="40" rx="25" ry="30" fill="#4169E1" />
                <ellipse cx="50" cy="40" rx="18" ry="22" fill="#32CD32" />
                <ellipse cx="50" cy="40" rx="10" ry="12" fill="#FFD700" />
                <circle cx="50" cy="40" r="5" fill="#000080" />

                {/* Feather barbs */}
                <path d="M 50 70 Q 40 100 35 130" stroke="#228B22" strokeWidth="2" fill="none" />
                <path d="M 50 70 Q 45 100 42 130" stroke="#32CD32" strokeWidth="1.5" fill="none" />
                <path d="M 50 70 Q 55 100 58 130" stroke="#32CD32" strokeWidth="1.5" fill="none" />
                <path d="M 50 70 Q 60 100 65 130" stroke="#228B22" strokeWidth="2" fill="none" />

                {/* Central quill */}
                <path d="M 50 70 L 50 180" stroke="#8B4513" strokeWidth="3" fill="none" />

                {/* Fine barbs along the quill */}
                {Array.from({ length: 10 }).map((_, i) => {
                    const y = 80 + i * 10
                    return (
                        <g key={i}>
                            <path d={`M 50 ${y} Q 40 ${y + 3} 35 ${y + 5}`} stroke="#228B22" strokeWidth="1" fill="none" opacity="0.6" />
                            <path d={`M 50 ${y} Q 60 ${y + 3} 65 ${y + 5}`} stroke="#228B22" strokeWidth="1" fill="none" opacity="0.6" />
                        </g>
                    )
                })}
            </g>
        </svg>
    )
}

export function TempleDomeDecoration({ className = "" }: PichwaiDecorationProps) {
    return (
        <svg
            className={className}
            viewBox="0 0 200 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Temple dome silhouette */}
            <g opacity="0.12">
                {/* Main dome */}
                <path d="M 100 20 Q 60 50 60 80 L 140 80 Q 140 50 100 20 Z" fill="#FF9933" />

                {/* Dome detail lines */}
                <path d="M 100 20 L 100 80" stroke="#FFD700" strokeWidth="2" opacity="0.5" />
                <path d="M 80 40 Q 100 30 120 40" stroke="#FFD700" strokeWidth="1.5" fill="none" opacity="0.4" />

                {/* Spire */}
                <rect x="95" y="5" width="10" height="20" fill="#B8860B" rx="2" />
                <circle cx="100" cy="5" r="4" fill="#FFD700" />

                {/* Temple pillars */}
                <rect x="70" y="80" width="12" height="60" fill="#CD853F" rx="2" />
                <rect x="118" y="80" width="12" height="60" fill="#CD853F" rx="2" />

                {/* Base */}
                <rect x="60" y="135" width="80" height="10" fill="#8B4513" rx="2" />

                {/* Decorative bells */}
                <circle cx="70" cy="75" r="3" fill="#FFD700" />
                <circle cx="130" cy="75" r="3" fill="#FFD700" />
            </g>
        </svg>
    )
}

export function BellDecoration({ className = "" }: PichwaiDecorationProps) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Temple bell */}
            <g opacity="0.15">
                {/* Bell top hook */}
                <rect x="45" y="10" width="10" height="15" fill="#B8860B" rx="5" />

                {/* Bell body */}
                <path d="M 35 25 Q 35 40 30 60 L 30 80 Q 30 85 35 85 L 65 85 Q 70 85 70 80 L 70 60 Q 65 40 65 25 Z" fill="#FFD700" />

                {/* Bell details */}
                <path d="M 40 40 Q 50 35 60 40" stroke="#FFA500" strokeWidth="2" fill="none" />
                <path d="M 38 55 Q 50 50 62 55" stroke="#FFA500" strokeWidth="2" fill="none" />

                {/* Bell clapper */}
                <circle cx="50" cy="95" r="5" fill="#8B4513" />
                <line x1="50" y1="85" x2="50" y2="90" stroke="#8B4513" strokeWidth="2" />

                {/* Decorative patterns */}
                <circle cx="50" cy="30" r="2" fill="#FF6347" />
                <circle cx="40" cy="70" r="1.5" fill="#FF6347" />
                <circle cx="60" cy="70" r="1.5" fill="#FF6347" />
            </g>
        </svg>
    )
}

export function ConchShellDecoration({ className = "" }: PichwaiDecorationProps) {
    return (
        <svg
            className={className}
            viewBox="0 0 150 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Conch shell (Shankh) */}
            <g opacity="0.12">
                {/* Main spiral body */}
                <path d="M 75 30 Q 100 40 100 70 Q 100 100 75 110 Q 50 100 50 70 Q 50 40 75 30 Z" fill="#FFF8DC" stroke="#DEB887" strokeWidth="2" />

                {/* Inner spiral */}
                <path d="M 75 45 Q 85 50 85 70 Q 85 90 75 95 Q 65 90 65 70 Q 65 50 75 45 Z" fill="#F5DEB3" />

                {/* Spiral lines */}
                <path d="M 75 30 Q 90 50 85 70" stroke="#D2B48C" strokeWidth="1.5" fill="none" opacity="0.6" />
                <path d="M 75 30 Q 60 50 65 70" stroke="#D2B48C" strokeWidth="1.5" fill="none" opacity="0.6" />

                {/* Opening/mouth */}
                <ellipse cx="75" cy="110" rx="20" ry="8" fill="#FFE4B5" />

                {/* Decorative dots */}
                <circle cx="75" cy="60" r="2" fill="#FFD700" />
                <circle cx="70" cy="75" r="1.5" fill="#FFD700" />
                <circle cx="80" cy="75" r="1.5" fill="#FFD700" />
            </g>
        </svg>
    )
}

export function MandalaDecoration({ className = "" }: PichwaiDecorationProps) {
    return (
        <svg
            className={className}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Simplified Mandala pattern */}
            <g opacity="0.1">
                {/* Center circle */}
                <circle cx="100" cy="100" r="15" fill="#FF9933" />
                <circle cx="100" cy="100" r="10" fill="#FFD700" />

                {/* Inner ring of petals */}
                {Array.from({ length: 8 }).map((_, i) => {
                    const angle = (i * 45 * Math.PI) / 180
                    const x = 100 + Math.cos(angle) * 30
                    const y = 100 + Math.sin(angle) * 30
                    return (
                        <circle key={`inner-${i}`} cx={x} cy={y} r="8" fill="#FFA07A" opacity="0.8" />
                    )
                })}

                {/* Middle ring of petals */}
                {Array.from({ length: 12 }).map((_, i) => {
                    const angle = (i * 30 * Math.PI) / 180
                    const x = 100 + Math.cos(angle) * 55
                    const y = 100 + Math.sin(angle) * 55
                    return (
                        <ellipse key={`middle-${i}`} cx={x} cy={y} rx="6" ry="12" fill="#FF6B35" opacity="0.6" transform={`rotate(${i * 30} ${x} ${y})`} />
                    )
                })}

                {/* Outer ring of dots */}
                {Array.from({ length: 16 }).map((_, i) => {
                    const angle = (i * 22.5 * Math.PI) / 180
                    const x = 100 + Math.cos(angle) * 80
                    const y = 100 + Math.sin(angle) * 80
                    return (
                        <circle key={`outer-${i}`} cx={x} cy={y} r="4" fill="#FFD700" opacity="0.5" />
                    )
                })}

                {/* Connecting lines */}
                {Array.from({ length: 8 }).map((_, i) => {
                    const angle = (i * 45 * Math.PI) / 180
                    const x1 = 100 + Math.cos(angle) * 20
                    const y1 = 100 + Math.sin(angle) * 20
                    const x2 = 100 + Math.cos(angle) * 85
                    const y2 = 100 + Math.sin(angle) * 85
                    return (
                        <line key={`line-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFA500" strokeWidth="1" opacity="0.4" />
                    )
                })}
            </g>
        </svg>
    )
}

export function FootprintsDecoration({ className = "" }: PichwaiDecorationProps) {
    return (
        <svg
            className={className}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Holy Footprints (Charan) */}
            <g opacity="0.3">
                {/* Left Foot */}
                <path d="M 60 50 Q 50 50 45 70 Q 40 100 50 130 Q 60 150 80 150 Q 95 150 100 130 Q 105 100 95 70 Q 90 50 80 50 Q 70 50 60 50 Z" fill="#FF8C00" opacity="0.5" />

                {/* Toes Left */}
                <circle cx="50" cy="40" r="5" fill="#FF8C00" opacity="0.6" />
                <circle cx="62" cy="38" r="4" fill="#FF8C00" opacity="0.6" />
                <circle cx="72" cy="38" r="4" fill="#FF8C00" opacity="0.6" />
                <circle cx="82" cy="40" r="3.5" fill="#FF8C00" opacity="0.6" />
                <circle cx="90" cy="45" r="3" fill="#FF8C00" opacity="0.6" />

                {/* Right Foot */}
                <path d="M 140 50 Q 150 50 155 70 Q 160 100 150 130 Q 140 150 120 150 Q 105 150 100 130 Q 95 100 105 70 Q 110 50 120 50 Q 130 50 140 50 Z" fill="#FF8C00" opacity="0.5" />

                {/* Toes Right */}
                <circle cx="150" cy="40" r="5" fill="#FF8C00" opacity="0.6" />
                <circle cx="138" cy="38" r="4" fill="#FF8C00" opacity="0.6" />
                <circle cx="128" cy="38" r="4" fill="#FF8C00" opacity="0.6" />
                <circle cx="118" cy="40" r="3.5" fill="#FF8C00" opacity="0.6" />
                <circle cx="110" cy="45" r="3" fill="#FF8C00" opacity="0.6" />

                {/* Auspicious Marks (Simplified) */}
                <circle cx="75" cy="100" r="10" stroke="#FFD700" strokeWidth="1" fill="none" opacity="0.4" />
                <path d="M 125 90 L 135 110 L 115 110 Z" stroke="#FFD700" strokeWidth="1" fill="none" opacity="0.4" />
            </g>
        </svg>
    )
}
