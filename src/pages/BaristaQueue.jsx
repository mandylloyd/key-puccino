import { useState, useRef } from 'react';
import Logout from './Logout';

// TODO: solve for bug caused by clicking through ingredient buttons quickly

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
    // retreieve guest order from localstorage if it got lost during logout/in
    const order = guestOrder?.ingredients?.[0] !== 'none'
        ? guestOrder
        : JSON.parse(localStorage.getItem('guestOrder'));

    // layers are "cup" ingredients being poured from bottom up
    const [layers, setLayers] = useState([]);
    // keeps UI in sync with currentFillRef
    const [currentFill, setCurrentFill] = useState(0);
    // ingredient color currently being poured
    const [fillColor, setFillColor] = useState('#3B1A08');
    // track disabled buttons to end game
    const [lockedIngredients, setLockedIngredients] = useState([]);

    // solves stale closures
    const intervalRef = useRef(null);
    const isFillingRef = useRef(false);
    const currentFillRef = useRef(0);
    const totalPouredRef = useRef(0);
    const fillColorRef = useRef('#3B1A08');
    const layersRef = useRef([]);

const startFilling = (ingredient) => {
    // safe gaurd to avoid bug where pointer events were still working with disabled buttons
    if (lockedIngredients.includes(ingredient.name)) return;

    // set color in state and useRef for UI accuracy
    const color = ingredientColors[ingredient.name] || '#3B1A08';
    setFillColor(color);
    fillColorRef.current = color;

    // record filling action so chaotic pointer behavior can't disable buttons early
    isFillingRef.current = true;

    // use timeout to pace filling (TODO: add option to change pace to up difficulty)
    // use refs because setInterval cant see state updates
    intervalRef.current = setInterval(() => {
        // Stop filling if we've reached the top of the cup
        const remainingSpace = 100 - totalPouredRef.current;
        if (currentFillRef.current >= remainingSpace) {
            clearInterval(intervalRef.current);
            return;
        }
        // maintain UI accuracy with use ref, trigger ui re-render
        currentFillRef.current = currentFillRef.current + 1;
        setCurrentFill(currentFillRef.current);
    }, 50);
};

    const stopFilling = (ingredientName) => {
        // return early if not actually filling
        if (!isFillingRef.current) return;
        isFillingRef.current = false;
        clearInterval(intervalRef.current);

        // final pour amount
        const amount = currentFillRef.current;
        const color = fillColorRef.current;

        // lock new layer into the "cup" bar
        const newLayer = { name: ingredientName, amount, color };
        const updatedLayers = [...layersRef.current, newLayer];

        // sync refs
        layersRef.current = updatedLayers;
        totalPouredRef.current = totalPouredRef.current + amount;
        currentFillRef.current = 0;

        // disable ingredient button to lock in score
        setLayers(updatedLayers);
        setCurrentFill(0);
        setLockedIngredients(updatedLayers.map(layer => layer.name));

        // make App aware game is over
        if (updatedLayers.length === order.ingredients.length) {
            onOrderComplete({ layers: updatedLayers, drink: order });
        }
    };

    return (
        <div>
            <h2>Order: {order.name}</h2>

            {/* the "cup" (tall bar) builds up from the bottom as each ingredient is "poured" */}
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

                        // *note that mouse events were not effective on chrome
                        // plus pointer events are more modern*
                    >
                        {ingredient.name} ({ingredient.target}%)
                    </button>
                ))
            )}
        </div>
    );
}