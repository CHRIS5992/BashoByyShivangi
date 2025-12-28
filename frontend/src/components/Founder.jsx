import React, { useEffect, useRef } from 'react';
import './Founder.css';

const Founder = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observerOptions = {
            root: null,
            threshold: 0.2 // Trigger when 20% visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        if (sectionRef.current) {
            const fadeElements = sectionRef.current.querySelectorAll('.fade-in');
            fadeElements.forEach(el => observer.observe(el));
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            className="founder-section"
            ref={sectionRef}
            style={{ backgroundImage: "url('/images/gallery/founderbg.jpg')" }}
        >
            <div className="founder-container">

                {/* Image Side - Left/Center */}
                <div className="founder-pimage-wrapper fade-in">
                    <div className="founder-frame">
                        <img
                            src="/static/images/gallery/founder.png"
                            alt="Shivangi - Founder of Basho"
                            className="founder-img"
                        />
                    </div>
                </div>

                {/* Text Side - Right Aligned */}
                <div className="founder-content fade-in delay-content">
                    <h2 className="founder-heading">Founder’s Journey & Vision</h2>

                    <div className="founder-body">
                        <p>
                            Basho began as a personal exploration of clay, patience, and process.
                        </p>
                        <p>
                            Rooted in Japanese philosophy and inspired by the poet Bashō,
                            the brand reflects a belief in slow craft, intentional living,
                            and finding meaning in everyday rituals.
                        </p>
                        <p>
                            Shivangi’s journey is shaped by hands-on practice —
                            working closely with material, embracing imperfection,
                            and allowing time to play an active role in creation.
                        </p>
                        <p>
                            Through Basho, her vision extends beyond objects.
                            It is about sharing the process, opening the studio,
                            and creating spaces where people can connect with craft,
                            culture, and the quiet joy of making.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Founder;
