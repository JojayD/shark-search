// components/Footer.tsx

import React from 'react';

type Props = {
  creatorName: string;
  csulbLink?: string;
};

export default function Footer({ creatorName, csulbLink = "https://www.csulb.edu" }: Props) {
  return (
    <footer className="w-full bg-amber-400 text-white py-4">
      <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* CSULB Link */}
        <div className="mb-2 md:mb-0">
          <a
            href={csulbLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline"
          >
            Visit CSULB Website
          </a>
        </div>

        {/* Created By Section */}
        <div>
          <p className="text-sm">
            Created by <span className="font-semibold">{creatorName}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
