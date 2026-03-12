import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';

// define the difficulty levels
const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 };

export default function ManagerBoard({ completedOrder }) {
    const { keycloak } = useKeycloak();
    const [leaderboard, setLeaderboard] = useState([]);

    // access local storage if we lost the order state
    const order = completedOrder || JSON.parse(localStorage.getItem('completedOrder'));

    const calculateScore = () => {
        // map over each ingredient layer in the cup
        const ingredientScores = order.layers.map((layer) => {
            // find ingredient name matching layer name to get target %
            const target = order.drink.ingredients.find(ingredient => ingredient.name === layer.name).target;
            // adjust for over or under pour using abs
            const howFarOff = Math.abs(layer.amount - target);
            // without going below zero make the score a percentage
            const accuracy = Math.max(0, 100 - (howFarOff / target) * 100);
            return accuracy;
        });

        // average the scores
        const averageAccuracy = ingredientScores.reduce((sum, score) => sum + score, 0) / ingredientScores.length;
        const multiplier = difficultyMultiplier[order.drink.difficulty];
        // and apply multiplyer
        return Math.round(averageAccuracy * multiplier);
    };

    // useEffect to load leaderboard once the recent score gets applied
    // uses keycloak JWT to get username
    useEffect(() => {
        // if no pending completedOrder load the existing leaderboard
        // early return if the leaderboard has already been set in localstorage which triggered useEffect
        if (!localStorage.getItem('completedOrder')) {
            setLeaderboard(JSON.parse(localStorage.getItem('leaderboard')) || []);
            return;
        }

        // get username from Keycloak JWT
        const username = keycloak.tokenParsed?.preferred_username || 'unknown';
        const score = calculateScore();

        const existingEntries = JSON.parse(localStorage.getItem('leaderboard')) || [];
        // build entry
        const newEntry = { username, drink: order.drink.name, difficulty: order.drink.difficulty, score };
        // combine entries and arrange list in sorted order
        const updatedLeaderboard = [...existingEntries, newEntry].sort((a, b) => b.score - a.score);

        // set leaderboard to localStorage, this triggers rerender and useEffect will run again
        localStorage.setItem('leaderboard', JSON.stringify(updatedLeaderboard));
        // remove completedOrder so the first check in this useEffect returns early
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