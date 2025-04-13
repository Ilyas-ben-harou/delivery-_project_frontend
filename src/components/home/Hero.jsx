"use client"

import { useState, useEffect } from "react"

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0)

    // Array of background images
    const backgroundImages = [
        "/images/1.jpg",
        "/images/4.jpg",
        "/images/2.jpg",
        "/images/3.jpg",
    ]

    // Auto-rotate through slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % backgroundImages.length)
        }, 5000) // Change slide every 5 seconds

        return () => clearInterval(interval)
    }, [])

    return (
        <section className="relative text-white overflow-hidden h-screen">
            {/* Slideshow background images */}
            {backgroundImages.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 bg-center bg-cover transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                        }`}
                    style={{ backgroundImage: `url(${image})` }}
                >
                    <div className="h-full w-full bg-blue-300/15"></div>
                </div>
            ))}

            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-indigo-900/60 z-10"></div>

            {/* Floating Text Content */}
            <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-20">
                <div className="max-w-2xl mx-auto text-center animate-float">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        We Deliver <span className="text-yellow-300">Anywhere</span>,
                        <br />
                        <span className="text-yellow-300">Anytime</span>
                    </h1>

                    <p className="text-xl md:text-2xl mb-10 text-gray-100">
                        Fast, secure, and reliable delivery services nationwide
                    </p>

                    <a
                        href="/register"
                        className="inline-block bg-yellow-500 hover:bg-yellow-400 text-blue-900 px-10 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-xl"
                    >
                        Create Your Account
                    </a>

                    <div className="mt-12 flex flex-col items-center">
                        <div className="flex -space-x-4 mb-3">
                            <img src="/api/placeholder/60/60" alt="Customer" className="w-12 h-12 rounded-full border-2 border-white" />
                            <img src="/api/placeholder/60/60" alt="Customer" className="w-12 h-12 rounded-full border-2 border-white" />
                            <img src="/api/placeholder/60/60" alt="Customer" className="w-12 h-12 rounded-full border-2 border-white" />
                            <img src="/api/placeholder/60/60" alt="Customer" className="w-12 h-12 rounded-full border-2 border-white" />
                            <div className="w-12 h-12 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-white font-bold">
                                +2k
                            </div>
                        </div>
                        <p className="text-gray-200">
                            Join thousands of satisfied customers nationwide
                        </p>
                    </div>
                </div>
            </div>

            {/* Slide indicators */}
            <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center space-x-2">
                {backgroundImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? "bg-yellow-300 w-6" : "bg-white/50"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    ></button>
                ))}
            </div>

            <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
        </section>
    );
}