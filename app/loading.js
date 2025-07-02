"use client"

import React from 'react';

// Main App component to demonstrate the loader in a full-screen, centered layout.
export default function App() {
    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
            <Loader />
        </div>
    );
}

// The Loader component, now adapted for a light theme.
const Loader = () => {
    return (
        <>
            {/* The <style> tag is included directly here to keep the component self-contained.
              It holds all the necessary animation and styling rules.
            */}
            <style>
                {`
                  /* The main container for the loader text and animation */
                  .loader-container {
                    color: #4a5568; /* Equivalent to Tailwind's text-gray-700 */
                    font-family: "Inter", "Poppins", sans-serif;
                    font-weight: 500;
                    font-size: 1.5rem; /* 24px */
                    display: flex;
                    align-items: center;
                    padding: 1rem;
                  }

                  /* This container holds the vertically spinning words */
                  .words {
                    overflow: hidden;
                    position: relative;
                    height: 2.25rem; /* Slightly taller than the font size to prevent clipping */
                  }

                  /* This pseudo-element creates a soft fading effect at the top and bottom
                    of the .words container, making the text appear to slide in and out
                    from behind the background. The background color MUST match the page's
                    background color for the effect to work.
                  */
                  .words::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                      #F9FAFB 10%,  /* bg-gray-50 */
                      transparent 30%,
                      transparent 70%,
                      #F9FAFB 90%   /* bg-gray-50 */
                    );
                    z-index: 10;
                  }

                  /* Individual spinning word style */
                  .word {
                    display: block;
                    height: 100%;
                    padding-left: 0.5rem; /* 8px */
                    color: #8B5CF6; /* text-violet-500 */
                    animation: spin_words 5s infinite;
                  }

                  /* Keyframe animation for the vertical spinning effect.
                    It translates the entire column of words up in steps.
                  */
                  @keyframes spin_words {
                    10% {
                      transform: translateY(-112%);
                    }
                    25% {
                      transform: translateY(-100%);
                    }
                    35% {
                      transform: translateY(-212%);
                    }
                    50% {
                      transform: translateY(-200%);
                    }
                    60% {
                      transform: translateY(-312%);
                    }
                    75% {
                      transform: translateY(-300%);
                    }
                    85% {
                      transform: translateY(-412%);
                    }
                    100% {
                      transform: translateY(-400%);
                    }
                  }
                `}
            </style>
            <div className="loader-container">
                <p>Loading</p>
                <div className="words">
                    <span className="word">amenities...</span>
                    <span className="word">room details...</span>
                    <span className="word">gallery...</span>
                    <span className="word">features...</span>
                    <span className="word">availability...</span>
                </div>
            </div>
        </>
    );
};
