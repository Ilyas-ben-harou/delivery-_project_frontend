import React from 'react';
import Header from './Header';
import Hero from './Hero';
import Features from './Features';
import Footer from './Footer';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <Hero />
                <Features />
            </main>
            <Footer />
        </div>
    );
}
