import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Home: React.FC = () => {
    const location = useLocation();

    // Handle hash scrolling for #books
    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    return (
        <>
            {/* Hero */}
            <section className="hero">
                <h1>জ্ঞান সংশ্লেষণ</h1>
                <p>Atomic Habits, Deep Work, Stoicism এবং Dopamine Detox এর নির্যাস থেকে তৈরি আপনার ব্যক্তিগত "দ্বিতীয় মস্তিষ্ক"।</p>
            </section>

            {/* Books Grid */}
            <h2 id="books">📚 বইসমূহ</h2>
            <div className="cards-grid">
                <Link to="/books/atomic-habits.html" className="book-card atomic" style={{ textDecoration: 'none', color: 'inherit', display: 'block', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <i className="fa-solid fa-atom" style={{ fontSize: '1.5rem', color: '#6AD1FF' }}></i>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Atomic Habits</h3>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>ক্ষুদ্র পরিবর্তন, অসাধারণ ফলাফল।</p>
                </Link>
                <Link to="/books/deep-work.html" className="book-card deepwork" style={{ textDecoration: 'none', color: 'inherit', display: 'block', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <i className="fa-solid fa-brain" style={{ fontSize: '1.5rem', color: '#818CF8' }}></i>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Deep Work</h3>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>বিক্ষেপমুক্ত মনোযোগের শিল্প।</p>
                </Link>
                <Link to="/books/daily-stoic.html" className="book-card stoic" style={{ textDecoration: 'none', color: 'inherit', display: 'block', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <i className="fa-solid fa-monument" style={{ fontSize: '1.5rem', color: '#FCD34D' }}></i>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>The Daily Stoic</h3>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>প্রাচীন জ্ঞান, আধুনিক প্রয়োগ।</p>
                </Link>
                <Link to="/books/dopamine-detox.html" className="book-card dopamine" style={{ textDecoration: 'none', color: 'inherit', display: 'block', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <i className="fa-solid fa-bolt" style={{ fontSize: '1.5rem', color: '#F87171' }}></i>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Dopamine Detox</h3>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>মনোযোগ ফিরিয়ে আনুন।</p>
                </Link>
            </div>

            {/* Framework */}
            <section className="framework" style={{ marginTop: '3rem', background: 'var(--surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h2 style={{ marginTop: 0 }}>🧠 ইউনিফাইড নলেজ প্রোটোকল</h2>
                <p>শুধুমাত্র বই পড়া নয়, জ্ঞানকে জীবনে প্রয়োগ করার জন্য একটি সমন্বিত ফ্রেমওয়ার্ক। এই প্রোটোকলটি আপনার দৈনন্দিন রুটিন, মানসিকতা এবং কাজের ধরণকে অপ্টিমাইজ করে।</p>

                <div className="pillars" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                    <div className="pillar" style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--grid-line)' }}>
                        <div className="pillar-num" style={{ background: 'var(--accent)', color: '#000', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>১</div>
                        <div className="pillar-text">Identity-Based Habits</div>
                    </div>
                    <div className="pillar" style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--grid-line)' }}>
                        <div className="pillar-num" style={{ background: 'var(--accent)', color: '#000', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>২</div>
                        <div className="pillar-text">Deep Work Blocks</div>
                    </div>
                    <div className="pillar" style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--grid-line)' }}>
                        <div className="pillar-num" style={{ background: 'var(--accent)', color: '#000', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>৩</div>
                        <div className="pillar-text">Dopamine Regulation</div>
                    </div>
                </div>

                <Link to="/protocols/life-protocol.html" className="cta-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem', background: 'var(--accent)', color: '#050608', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
                    প্রোটোকল দেখুন <i className="fa-solid fa-arrow-right"></i>
                </Link>
            </section>
        </>
    );
};

export default Home;
