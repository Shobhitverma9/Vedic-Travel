'use client';

import Image from 'next/image';

interface PreloaderProps {
    fullScreen?: boolean;
}

const Preloader = ({ fullScreen = true }: PreloaderProps) => {
    return (
        <div className={`${fullScreen ? 'min-h-screen fixed inset-0 z-[9999] bg-white' : 'w-full h-full flex-grow'} flex items-center justify-center`}>
            <div className="relative flex flex-col items-center">
                <div className="w-32 h-32 md:w-48 md:h-48 relative">
                    <Image
                        src="/Main.gif"
                        alt="Vedic Travel Loader"
                        fill
                        className="object-contain"
                        priority
                        unoptimized
                    />
                </div>
                {/* Optional: Add a subtle loading text or progress bar if needed */}
                {/* <div className="mt-4 text-saffron font-display font-bold animate-pulse tracking-widest text-sm uppercase">Loading journey...</div> */}
            </div>
        </div>
    );
};

export default Preloader;
