import React, { useState } from 'react';

interface SliderProps {
    label: string;
    max: number;
    value: number;
    onChange: (val: number) => void;
    id: string;
}

const Slider = ({ label, max, value, onChange, id }: SliderProps) => (
    <div className="slider-container" style={{ margin: '1.5rem 0' }}>
        <div className="slider-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
            <span>{label}</span>
            <span>{value}/{max}</span>
        </div>
        <input
            type="range"
            id={id}
            className="slider"
            min="0"
            max={max}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                background: 'var(--surface)',
                appearance: 'none',
                cursor: 'pointer'
            }}
        />
    </div>
);

export default function StoicSelfAssessment() {
    const [scores, setScores] = useState({
        emotion: 5,
        work: 4,
        discipline: 6,
        social: 7
    });

    const updateScore = (key: keyof typeof scores, val: number) => {
        setScores(prev => ({ ...prev, [key]: val }));
    };

    // Placeholder for chart functionality - in a real app, pass 'scores' to a Chart component
    // For now, we just show the sliders which manage their own state

    return (
        <div className="card" style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <p style={{ marginBottom: '1rem', color: 'var(--muted)' }}>স্লাইডার ব্যবহার করে আজকের দিনের মূল্যায়ন করুন:</p>

            <Slider
                label="আবেগ নিয়ন্ত্রণ"
                max={10}
                value={scores.emotion}
                onChange={(v) => updateScore('emotion', v)}
                id="emotion-slider"
            />
            <Slider
                label="ডিপ ওয়ার্ক ঘণ্টা"
                max={8}
                value={scores.work}
                onChange={(v) => updateScore('work', v)}
                id="work-slider"
            />
            <Slider
                label="শৃঙ্খলা (Discipline)"
                max={10}
                value={scores.discipline}
                onChange={(v) => updateScore('discipline', v)}
                id="discipline-slider"
            />
            <Slider
                label="সোশ্যাল মিডিয়া সংযম"
                max={10}
                value={scores.social}
                onChange={(v) => updateScore('social', v)}
                id="social-slider"
            />

            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <h4 style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>Daily Score</h4>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                    Stoic Score: {Math.round((scores.emotion + scores.discipline) / 2)}/10
                </p>
            </div>
        </div>
    );
}
