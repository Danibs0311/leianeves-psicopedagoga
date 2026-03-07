
import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { PainPoints } from '../components/PainPoints';
import { ProfessionalProfile } from '../components/ProfessionalProfile';
import { HowItWorks } from '../components/HowItWorks';
import { Benefits } from '../components/Benefits';
import { Authority } from '../components/Authority';
import { FinalCTA } from '../components/FinalCTA';
import { Footer } from '../components/Footer';
import { SchedulingModal } from '../components/SchedulingModal';

export const Home: React.FC = () => {
    const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);

    useEffect(() => {
        // Add smooth scrolling to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                if (href) {
                    document.querySelector(href)?.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar onOpenScheduling={() => setIsSchedulingModalOpen(true)} />
            <main>
                <Hero onOpenScheduling={() => setIsSchedulingModalOpen(true)} />
                <PainPoints />
                <ProfessionalProfile />
                <HowItWorks />
                <Benefits />
                <Authority />
                <FinalCTA onOpenScheduling={() => setIsSchedulingModalOpen(true)} />
            </main>
            <Footer />
            <SchedulingModal
                isOpen={isSchedulingModalOpen}
                onClose={() => setIsSchedulingModalOpen(false)}
            />
        </div>
    );
};
