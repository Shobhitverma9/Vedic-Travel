import React from 'react';

interface SectionDividerProps {
    type?: 'water' | 'coral' | 'floral';
    color?: string;
    className?: string;
    flip?: boolean;
}

export default function SectionDivider({
    type = 'water',
    color = '#e0f2fe', // default light blue (sky-100)
    className = '',
    flip = false,
}: SectionDividerProps) {
    // SVG paths for different types
    const svgs = {
        water: (
            <svg
                className={`w-full h-auto max-h-[100px] sm:max-h-[150px] ${flip ? 'rotate-180' : ''}`}
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill={color}
                    fillOpacity="1"
                    d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
            </svg>
        ),
        coral: (
            <svg
                className={`w-full h-auto max-h-[80px] sm:max-h-[120px] ${flip ? 'rotate-180' : ''}`}
                viewBox="0 0 1440 200"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill={color}
                    fillOpacity="1"
                    d="M0,96L80,112C160,128,320,160,480,149.3C640,139,800,85,960,69.3C1120,53,1280,75,1360,85.3L1440,96L1440,200L1360,200C1280,200,1120,200,960,200C800,200,640,200,480,200C320,200,160,200,80,200L0,200Z"
                ></path>
            </svg>
        ),
        floral: (
            <svg
                className={`w-full h-auto max-h-[100px] sm:max-h-[140px] ${flip ? 'rotate-180' : ''}`}
                viewBox="0 0 1440 100"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill={color}
                    fillOpacity="1"
                    d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 C1150,100 1350,0 1440,50 L1440,100 L0,100 Z"
                ></path>
            </svg>
        ),
    };

    return (
        <div className={`w-full overflow-hidden leading-none block ${className}`} style={{ fontSize: 0 }}>
            {svgs[type]}
        </div>
    );
}
