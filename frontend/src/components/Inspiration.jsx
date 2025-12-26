import React, { useEffect, useRef } from 'react';
import './Inspiration.css';

const Inspiration = () => {
    const containerRef = useRef(null);

    // Observer for fade animations
    useEffect(() => {
        const observerOptions = {
            root: null,
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        if (containerRef.current) {
            const fadeItems = containerRef.current.querySelectorAll('.fade-item');
            fadeItems.forEach(item => observer.observe(item));
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section className="inspiration-container" ref={containerRef}>

            {/* Scroll Beat 1 - Base */}
            <div
                className="scroll-beat beat-1"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(/images/gallery/ipart1.jpg)`
                }}
            >
                {/* Decorative Corners in Beat 1 - Purely visual, aria-hidden */}
                <img
                    src="/images/gallery/ipart1topright.png"
                    alt=""
                    className="corner-deco top-right"
                    aria-hidden="true"
                />
                <img
                    src="/images/gallery/ipart1bottomleft.png"
                    alt=""
                    className="corner-deco bottom-left"
                    aria-hidden="true"
                />

                <div className="content-wrapper">
                    <p className="poetic-text fade-item delay-1">
                        Japanese poetry is not written to impress.<br />
                        It is written to observe.
                    </p>
                    <p className="poetic-text fade-item delay-2">
                        A falling leaf.<br />
                        A quiet morning.<br />
                        A moment that passes without asking to be remembered.
                    </p>
                </div>
            </div>

            {/* Scroll Beat 2 - Scattered Rotation */}
            <div
                className="scroll-beat beat-2"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/images/gallery/ipart2.jpg)`
                }}
            >
                <div className="content-wrapper">
                    <h3 className="beat-title fade-item">Basho draws from this way of seeing the world.</h3>
                    <p className="poetic-text fade-item delay-1">
                        Inspired by Japanese poetry and culture,<br />
                        the brand believes beauty does not need perfection.<br />
                        It needs honesty, patience, and presence.
                    </p>
                </div>
            </div>

            {/* Scroll Beat 3 - Scattered Rotation */}
            <div
                className="scroll-beat beat-3"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(/images/gallery/ipart3.jpg)`
                }}
            >
                <div className="content-wrapper">
                    <h3 className="beat-title fade-item">Japanese culture embraces wabi-sabi —</h3>
                    <p className="poetic-text fade-item delay-1">
                        the acceptance of imperfection, impermanence, and incompleteness.
                    </p>
                    <p className="poetic-text fade-item delay-2">
                        In Basho’s pottery,<br />
                        uneven rims, raw textures, and natural variations<br />
                        are not flaws.
                    </p>
                    <p className="poetic-text emphasis fade-item delay-3">
                        They are intentional.
                    </p>
                </div>
            </div>

            {/* Scroll Beat 4 - Standard Stack */}
            <div
                className="scroll-beat beat-4"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(/images/gallery/ipart4.jpg)`
                }}
            >
                <div className="content-wrapper">
                    <p className="poetic-text fade-item text-bold">
                        Every Basho piece reflects this philosophy.
                    </p>
                    <div className="list-like fade-item delay-1">
                        <span>Handcrafted slowly.</span>
                        <span>Shaped by human touch.</span>
                        <span>Finished by fire and time.</span>
                    </div>
                    <p className="poetic-text closure fade-item delay-2">
                        <span className="text-highlight">No two pieces are the same,</span><br />
                        because no moment ever is.
                    </p>
                </div>
            </div>

        </section>
    );
};

export default Inspiration;
