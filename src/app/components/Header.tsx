// components/Header.tsx

import Image from "next/image";

type Props = {};

export default function Header({}: Props) {
    return (
        <header className="w-full bg-amber-400">
            <div className="max-w-screen-xl mx-auto px-4 py-2 flex justify-between items-center">
                {/* Left Side: Shark Search Text */}
                <div className="text-black text-xl font-bold">
                    Shark Seek
                </div>

                {/* Right Side: Shark Image */}
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
                    <Image
                        src="/shark.png"
                        alt="Shark Image"
                        width={70}
                        height={70}
                        objectFit="contain" // Ensures the entire image is visible
                        priority
                    />
                </div>
            </div>
        </header>
    );
}
