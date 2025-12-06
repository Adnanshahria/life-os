import React, { useState, useEffect } from 'react';

export default function PomodoroTimer() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            if (interval) clearInterval(interval);
            setIsActive(false);
            // Simple alert/notification or sound could go here
            if (!isBreak) {
                alert('Time for a break! (5 mins)');
                setTimeLeft(5 * 60);
                setIsBreak(true);
            } else {
                alert('Break over! Back to work.');
                setTimeLeft(25 * 60);
                setIsBreak(false);
            }
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, isBreak]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setIsBreak(false);
        setTimeLeft(25 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="timer-box" style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
            <div className="timer-display" style={{ fontSize: '3rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--accent)', marginBottom: '1rem' }}>
                {formatTime(timeLeft)}
            </div>
            <div className="timer-controls" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                    className="timer-btn"
                    onClick={toggleTimer}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        background: isActive ? 'var(--warning)' : 'var(--success)',
                        color: '#000'
                    }}
                >
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button
                    className="timer-btn"
                    onClick={resetTimer}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        background: 'var(--panel)',
                        color: 'var(--muted)'
                    }}
                >
                    Reset
                </button>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
                {isBreak ? 'Relax for 5 minutes.' : 'Focus for 25 minutes.'}
            </p>
        </div>
    );
}
