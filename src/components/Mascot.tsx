import React, { useState } from 'react';

interface MascotProps {
    onClick: () => void;
    selectedCostume: string;
}

interface FloatingHonk {
    id: number;
    x: number;
    y: number;
}

export const Mascot: React.FC<MascotProps> = ({ onClick, selectedCostume }) => {
    const [isPumping, setIsPumping] = useState(false);
    const [honks, setHonks] = useState<FloatingHonk[]>([]);
    const [nextId, setNextId] = useState(0);

    const getMascotPath = (costume: string) => {
        const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
        if (costume === 'scientist') return `${base}/mascot_scientist.png`;
        if (costume === 'athlete') return `${base}/mascot_athlete.png`;
        return `${base}/mascot_full.png`;
    };

    const handleClick = (e: React.MouseEvent) => {
        setIsPumping(true);
        onClick();

        // Create floating honk
        const newHonk: FloatingHonk = {
            id: nextId,
            x: e.clientX + (Math.random() * 40 - 20),
            y: e.clientY + (Math.random() * 40 - 20)
        };
        setHonks(prev => [...prev.slice(-10), newHonk]); // Limit to 10 active
        setNextId(id => id + 1);

        setTimeout(() => setIsPumping(false), 100);

        // Remove honk after animation
        setTimeout(() => {
            setHonks(prev => prev.filter(h => h.id !== newHonk.id));
        }, 800);
    };

    return (
        <div className="mascot-container">
            <button
                className={`mascot-button ${isPumping ? 'pumping' : ''}`}
                onClick={handleClick}
                aria-label={`Click the ${selectedCostume} mascot for honks`}
            >
                <img
                    src={getMascotPath(selectedCostume)}
                    alt={`University Mascot (${selectedCostume})`}
                    className="mascot-image"
                />
            </button>
            {honks.map(honk => (
                <div
                    key={honk.id}
                    className="floating-honk"
                    style={{ left: honk.x, top: honk.y }}
                >
                    HONK!
                </div>
            ))}
        </div>
    );
};
