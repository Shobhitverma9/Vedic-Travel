import React from "react"

interface SectionDividerProps {
    /** Position of the divider */
    position?: "top" | "bottom"
    /** Color of the previous section (above if position=bottom, below if position=top) */
    fromColor?: string
    /** Color of the next section */
    toColor?: string
    /** Whether to show decorative coral/saffron layer */
    showDecorativeLayer?: boolean
    /** Custom height for the divider */
    height?: string
    /** Which wave pattern to use */
    variant?: "wave1" | "wave2" | "wave3"
}

export function SectionDivider({
    position = "bottom",
    fromColor = "fill-gray-50",
    toColor = "fill-amber-50",
    showDecorativeLayer = true,
    height = "h-[40px] md:h-[60px]",
    variant = "wave1"
}: SectionDividerProps) {
    const isTop = position === "top"

    // Different wave path patterns
    const wavePaths = {
        wave1: "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z",
        wave2: "M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z",
        wave3: "M0,96L48,90.7C96,85,192,75,288,74.7C384,75,480,85,576,96C672,107,768,117,864,112C960,107,1056,85,1152,80C1248,75,1344,85,1392,90.7L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
    }

    const selectedPath = wavePaths[variant]

    return (
        <div className={`absolute ${isTop ? 'top-0' : 'bottom-0'} left-0 w-full overflow-hidden leading-[0] z-20 ${isTop ? 'rotate-180' : ''}`}>
            <svg
                className={`relative block w-[calc(100%+1.3px)] ${height}`}
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
            >
                {showDecorativeLayer && (
                    <path
                        d={selectedPath}
                        className="fill-orange-400/20 dark:fill-orange-900/20"
                        transform="translate(0, 10)"
                    />
                )}
                <path
                    d={selectedPath}
                    className={`${isTop ? toColor : fromColor} dark:fill-zinc-900`}
                />
            </svg>
        </div>
    )
}

// Preset divider configurations for common transitions
export const DividerPresets = {
    grayToAmber: {
        fromColor: "fill-gray-50",
        toColor: "fill-amber-50",
        showDecorativeLayer: true
    },
    whiteToGray: {
        fromColor: "fill-white",
        toColor: "fill-gray-50",
        showDecorativeLayer: true
    },
    amberToWhite: {
        fromColor: "fill-amber-50",
        toColor: "fill-white",
        showDecorativeLayer: true
    },
    creamToWhite: {
        fromColor: "fill-cream",
        toColor: "fill-white",
        showDecorativeLayer: true
    },
    orangeToAmber: {
        fromColor: "fill-orange-50",
        toColor: "fill-amber-50",
        showDecorativeLayer: true
    }
}
