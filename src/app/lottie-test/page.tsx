"use client";

import { useState } from "react";
import LottieAnimation from "@/components/lottie-animation";

export default function LottieTest() {
  const [playOnHover, setPlayOnHover] = useState(false);
  const [playOnClick, setPlayOnClick] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Lottie Animation Test
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Test 1: Basic Animation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Animation</h2>
            <div className="flex justify-center">
              <LottieAnimation 
                animationData={null}
                size={100}
                loop={true}
                autoplay={true}
                ariaLabel="Basic animation"
              />
            </div>
          </div>
          
          {/* Test 2: Hover Animation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Hover Animation</h2>
            <div className="flex justify-center">
              <LottieAnimation 
                animationData={null}
                size={100}
                loop={true}
                autoplay={false}
                playOnHover={true}
                ariaLabel="Hover animation"
              />
            </div>
          </div>
          
          {/* Test 3: Click Animation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Click Animation</h2>
            <div className="flex justify-center">
              <LottieAnimation 
                animationData={null}
                size={100}
                loop={false}
                autoplay={false}
                playOnClick={true}
                ariaLabel="Click animation"
              />
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Animation Controls</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setPlayOnHover(!playOnHover)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Toggle Hover: {playOnHover ? "ON" : "OFF"}
            </button>
            <button
              onClick={() => setPlayOnClick(!playOnClick)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Toggle Click: {playOnClick ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}