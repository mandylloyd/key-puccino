import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';

// Higher difficulty = higher possible score
const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 };

export default function ManagerBoard({ completedOrder }) {
    const { keycloak } = useKeycloak();
    const [leaderboard, setLeaderboard] = useState([]);

    // Fall back to localStorage if state was wiped by a Keycloak redirect
    const order = completedOrder || JSON.parse(localStorage.getItem('completedOrder'));

    const calculateScore = () => {
        // Score each ingredient by how close the player got to the target percentage
        const ingredientScores = order.layers.map((layer) => {
            // get ingredient percent scored
            const target = order.drink.ingredients.find(ingredient => ingredient.name === layer.name).target;
            // adjust for over pour
            const howFarOff = Math.abs(layer.amount - target);
            // calculate overall accuracy
            const accuracy = Math.max(0, 100 - (howFarOff / target) * 100);
            return accuracy;
        });

        // average ingredient scores and apply the difficulty multiplier
        const averageAccuracy = ingredientScores.reduce((sum, score) => sum + score, 0) / ingredientScores.length;
        const multiplier = difficultyMultiplier[order.drink.difficulty];
        return Math.round(averageAccuracy * multiplier);
    };

    useEffect(() => {
        // if no pending completedOrder load the existing leaderboard
        if (!localStorage.getItem('completedOrder')) {
            setLeaderboard(JSON.parse(localStorage.getItem('leaderboard')) || []);
            return;
        }

        // get manager username from their Keycloak JWT
        const username = keycloak.tokenParsed?.preferred_username || 'unknown';
        const score = calculateScore();

        const existingEntries = JSON.parse(localStorage.getItem('leaderboard')) || [];
        const newEntry = { username, drink: order.drink.name, difficulty: order.drink.difficulty, score };
        const updatedLeaderboard = [...existingEntries, newEntry].sort((a, b) => b.score - a.score);

        localStorage.setItem('leaderboard', JSON.stringify(updatedLeaderboard));
        localStorage.removeItem('completedOrder');
        setLeaderboard(updatedLeaderboard);
    }, []);

    return (
        <div>
            <h2>Leaderboard</h2>
            {leaderboard.map((entry, index) => (
                <div key={index}>
                    <p>#{index + 1} {entry.username} — {entry.drink} ({entry.difficulty}) — {entry.score} pts</p>
                </div>
            ))}
            <button onClick={() => keycloak.logout({ redirectUri: 'http://localhost:5173/menu' })}>
                Play Again
            </button>
        </div>
    );
}