"use client"

import { useState, useEffect } from "react"

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [showChat, setShowChat] = useState(false)
    const [messages, setMessages] = useState([
        {
            text: "Bonjour! Je suis l'assistant virtuel de votre service de livraison. Comment puis-je vous aider?",
            sender: 'bot'
        }
    ])
    const [inputMessage, setInputMessage] = useState("")
    const [imagesLoaded, setImagesLoaded] = useState(false)

    // Array de background images avec fallback
    const backgroundImages = [
        { path: "/images/1.jpg", alt: "Livraison rapide" },
        { path: "/images/2.jpg", alt: "Service de livraison" },
        { path: "/images/3.jpg", alt: "Colis sécurisés" },
        { path: "/images/4.jpg", alt: "Camion de livraison" }
    ]

    // Préchargement des images
    useEffect(() => {
        const loadImages = async () => {
            const promises = backgroundImages.map(image => {
                return new Promise((resolve, reject) => {
                    const img = new Image()
                    img.src = image.path
                    img.onload = resolve
                    img.onerror = () => {
                        console.error(`Erreur de chargement de l'image: ${image.path}`)
                        reject()
                    }
                })
            })

            try {
                await Promise.all(promises)
                setImagesLoaded(true)
            } catch (error) {
                console.error("Certaines images n'ont pas pu charger")
                // On les affiche quand même mais avec un état loaded
                setImagesLoaded(true)
            }
        }

        loadImages()
    }, [])

    // Auto-rotate through slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % backgroundImages.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    const handleSendMessage = () => {
        if (inputMessage.trim() === "") return
        
        // Ajouter le message de l'utilisateur
        const userMessage = { text: inputMessage, sender: 'user' }
        setMessages([...messages, userMessage])
        setInputMessage("")
        
        // Réponse automatisée basée sur le contenu du message
        setTimeout(() => {
            let botMessage;
            const lowerCaseMessage = inputMessage.toLowerCase()

            if (lowerCaseMessage.includes('prix') || lowerCaseMessage.includes('tarif') || lowerCaseMessage.includes('coût')) {
                botMessage = {
                    text: "Nos tarifs de livraison dépendent de la distance et du poids. En moyenne:\n- Livraison locale: 5€\n- Livraison régionale: 10€\n- Livraison nationale: 15€\n\nVoulez-vous un devis précis?",
                    sender: 'bot'
                }
            } 
            else if (lowerCaseMessage.includes('ville') || lowerCaseMessage.includes('zone') || lowerCaseMessage.includes('desserv')) {
                botMessage = {
                    text: "Nous livrons dans toutes les grandes villes du pays:\n- Paris\n- Lyon\n- Marseille\n- Toulouse\n- Lille\n\nEt bien d'autres! Nous couvrons 95% du territoire.",
                    sender: 'bot'
                }
            }
            else if (lowerCaseMessage.includes('durée') || lowerCaseMessage.includes('temps') || lowerCaseMessage.includes('délai')) {
                botMessage = {
                    text: "Délais de livraison standard:\n- En ville: 24h\n- En région: 48h\n- National: 3-5 jours\n\nNous proposons aussi une option express (livraison en 12h).",
                    sender: 'bot'
                }
            }
            else {
                botMessage = {
                    text: "Je suis spécialisé dans les questions sur nos services de livraison. Voici ce que je peux vous dire:\n1. Quel est le prix de livraison?\n2. Dans quelles villes livrez-vous?\n3. Quel est le délai de livraison?",
                    sender: 'bot'
                }
            }

            setMessages(prev => [...prev, botMessage])
        }, 1000)
    }

    const handleQuickQuestion = (question) => {
        setInputMessage(question)
        // Simuler un clic sur envoyer après un petit délai pour l'UX
        setTimeout(() => {
            const sendButton = document.querySelector('.chat-send-button')
            if (sendButton) sendButton.click()
        }, 100)
    }

    return (
        <section className="relative text-white overflow-hidden h-screen">
            {/* Slideshow background images */}
            {backgroundImages.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 bg-center bg-cover transition-opacity duration-1000 ${
                        index === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ backgroundImage: `url(${image.path})` }}
                    aria-label={image.alt}
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
                            <img 
                                src="/images/avatar1.jpg" 
                                alt="Customer" 
                                className="w-12 h-12 rounded-full border-2 border-white" 
                                onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = "/images/avatar-placeholder.png"
                                }}
                            />
                            <img 
                                src="/images/avatar2.jpg" 
                                alt="Customer" 
                                className="w-12 h-12 rounded-full border-2 border-white"
                                onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = "/images/avatar-placeholder.png"
                                }}
                            />
                            <img 
                                src="/images/avatar3.jpg" 
                                alt="Customer" 
                                className="w-12 h-12 rounded-full border-2 border-white"
                                onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = "/images/avatar-placeholder.png"
                                }}
                            />
                            <img 
                                src="/images/avatar4.jpg" 
                                alt="Customer" 
                                className="w-12 h-12 rounded-full border-2 border-white"
                                onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = "/images/avatar-placeholder.png"
                                }}
                            />
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

            {/* Chatbot Button */}
            <button 
                onClick={() => setShowChat(!showChat)}
                className="fixed bottom-8 right-8 bg-yellow-500 text-blue-900 p-4 rounded-full shadow-xl z-30 hover:bg-yellow-400 transition-all flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="ml-2">Assistant</span>
            </button>

            {/* Chatbot Interface */}
            {showChat && (
                <div className="fixed bottom-24 right-8 w-96 bg-white rounded-lg shadow-xl z-30 overflow-hidden flex flex-col">
                    <div className="bg-blue-900 text-white p-4 flex justify-between items-center">
                        <h3 className="font-bold text-lg">Assistant Livraison</h3>
                        <button onClick={() => setShowChat(false)} className="text-white hover:text-yellow-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        {messages.map((message, index) => (
                            <div 
                                key={index} 
                                className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                            >
                                <div 
                                    className={`inline-block p-3 rounded-lg max-w-xs ${message.sender === 'user' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-200 text-gray-800'}`}
                                >
                                    {message.text.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Questions rapides */}
                    <div className="px-4 pb-2 bg-gray-100">
                        <p className="text-sm text-gray-600 mb-2">Questions rapides:</p>
                        <div className="flex flex-wrap gap-2">
                            <button 
                                onClick={() => handleQuickQuestion("Quel est le prix de livraison?")}
                                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full"
                            >
                                Prix de livraison?
                            </button>
                            <button 
                                onClick={() => handleQuickQuestion("Dans quelles villes livrez-vous?")}
                                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full"
                            >
                                Villes desservies?
                            </button>
                            <button 
                                onClick={() => handleQuickQuestion("Quel est le délai de livraison?")}
                                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full"
                            >
                                Délai de livraison?
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-4 border-t flex">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Posez votre question..."
                            className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="chat-send-button bg-blue-900 text-white px-4 rounded-r-lg hover:bg-blue-800"
                        >
                            Envoyer
                        </button>
                    </div>
                </div>
            )}

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