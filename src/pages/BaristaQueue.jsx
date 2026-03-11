import { useState, useRef } from 'react';
import Logout from './Logout';

// Need to solve for bug caused by clicking through ingredient buttons quickly

const ingredientColors = {
    'espresso shot': '#3B1A08',
    'hot water': '#C8A882',
    'steamed milk': '#F5E6D3',
    'milk foam': '#FAF3EB',
    'thick foam': '#FAF3EB',
    'whipped cream': '#FFFDF9',
    'chocolate syrup': '#2C1005',
    'vanilla syrup': '#C8A04A',
    'caramel drizzle': '#C67C2A',
    'chai concentrate': '#7B3F1E',
    'cinnamon': '#8B3A0F',
    'cold water': '#D6EAF8',
    'ice': '#EAF4FB',
    'milk': '#FDF6EE',
};

export default function BaristaQueue({ guestOrder, onOrderComplete }) {

    const order = guestOrder?.ingredients?.[0] !== 'none'
        ? guestOrder
        : JSON.parse(localStorage.getItem('guestOrder'));

    const [layers, setLayers] = useState([]);
    const [currentFill, setCurrentFill] = useState(0);
    const [fillColor, setFillColor] = useState('#3B1A08');
    const [lockedIngredients, setLockedIngredients] = useState([]);

    // Refs so that interval callbacks and event handlers always read live values
    const intervalRef = useRef(null);
    const isFillingRef = useRef(false);
    const currentFillRef = useRef(0);
    const totalPouredRef = useRef(0);
    const fillColorRef = useRef('#3B1A08');
    const layersRef = useRef([]);

    const startFilling = (ingredient) => {
        if (lockedIngredients.includes(ingredient.name)) return;

        const color = ingredientColors[ingredient.name] || '#3B1A08';
        setFillColor(color);
        fillColorRef.current = color;
        isFillingRef.current = true;

        intervalRef.current = setInterval(() => {
            const remainingSpace = 100 - totalPouredRef.current;
            if (currentFillRef.current >= remainingSpace) {
                clearInterval(intervalRef.current);
                return;
            }
            currentFillRef.current = currentFillRef.current + 1;
            setCurrentFill(currentFillRef.current);
        }, 50);
    };

    const stopFilling = (ingredientName) => {
        console.log('fireing')
        if (!isFillingRef.current) return;
        isFillingRef.current = false;
        clearInterval(intervalRef.current);

        const amount = currentFillRef.current;
        const color = fillColorRef.current;
        const newLayer = { name: ingredientName, amount, color };
        const updatedLayers = [...layersRef.current, newLayer];

        layersRef.current = updatedLayers;
        totalPouredRef.current = totalPouredRef.current + amount;
        currentFillRef.current = 0;

        setLayers(updatedLayers);
        setCurrentFill(0);
        setLockedIngredients(updatedLayers.map(l => l.name));

        if (updatedLayers.length === order.ingredients.length) {
            onOrderComplete({ layers: updatedLayers, drink: order });
        }
    };

    return (
        <div>
            <h2>Order: {order.name}</h2>

            {/* The cup builds up from the bottom as each ingredient is poured */}
            <div style={{ width: 100, height: 200, border: '2px solid black', overflow: 'hidden', display: 'flex', flexDirection: 'column-reverse' }}>
                {layers.map((layer, index) => (
                    <div key={index} style={{ width: '100%', height: `${layer.amount}%`, flexShrink: 0, background: layer.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'black' }}>
                        {layer.amount}%
                    </div>
                ))}
                {currentFill > 0 && (
                    <div style={{ width: '100%', height: `${currentFill}%`, flexShrink: 0, background: fillColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>
                        {currentFill}%
                    </div>
                )}
            </div>

            {lockedIngredients.length === order.ingredients.length ? (
                <Logout message="Log back in as manager to view your spot on the leaderboard!" redirectPath="/manager" />
            ) : (
                order.ingredients.map((ingredient) => (
                    <button
                        key={ingredient.name}
                        disabled={lockedIngredients.includes(ingredient.name)}
                        onPointerDown={() => startFilling(ingredient)}
                        onPointerUp={() => stopFilling(ingredient.name)}
                    >
                        {ingredient.name} ({ingredient.target}%)
                    </button>
                ))
            )}
        </div>
    );
}