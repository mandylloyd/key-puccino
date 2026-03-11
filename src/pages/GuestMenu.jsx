export default function GuestMenu({ getOrder, guestOrder, submitOrder }) {
const menu = [
    {
        id: 1, name: 'Espresso', difficulty: 'easy',
        ingredients: [
        { name: 'espresso shot', target: 100 }
        ]
    },
    {
        id: 2, name: 'Americano', difficulty: 'easy',
        ingredients: [
        { name: 'espresso shot', target: 33 },
        { name: 'hot water', target: 67 }
        ]
    },
    {
        id: 3, name: 'Flat White', difficulty: 'easy',
        ingredients: [
        { name: 'espresso shot', target: 25 },
        { name: 'steamed milk', target: 75 }
        ]
    },
    {
        id: 4, name: 'Cappuccino', difficulty: 'medium',
        ingredients: [
        { name: 'espresso shot', target: 33 },
        { name: 'steamed milk', target: 33 },
        { name: 'thick foam', target: 34 }
        ]
    },
    {
        id: 5, name: 'Latte', difficulty: 'medium',
        ingredients: [
        { name: 'espresso shot', target: 20 },
        { name: 'steamed milk', target: 72 },
        { name: 'milk foam', target: 8 }
        ]
    },
    {
        id: 6, name: 'Macchiato', difficulty: 'medium',
        ingredients: [
        { name: 'espresso shot', target: 67 },
        { name: 'milk foam', target: 25 },
        { name: 'caramel drizzle', target: 8 }
        ]
    },
    {
        id: 7, name: 'Mocha', difficulty: 'hard',
        ingredients: [
        { name: 'espresso shot', target: 20 },
        { name: 'chocolate syrup', target: 15 },
        { name: 'steamed milk', target: 55 },
        { name: 'whipped cream', target: 10 }
        ]
    },
    {
        id: 8, name: 'Vanilla Latte', difficulty: 'hard',
        ingredients: [
        { name: 'espresso shot', target: 20 },
        { name: 'vanilla syrup', target: 10 },
        { name: 'steamed milk', target: 62 },
        { name: 'milk foam', target: 8 }
        ]
    },
    {
        id: 9, name: 'Chai Latte', difficulty: 'hard',
        ingredients: [
        { name: 'chai concentrate', target: 40 },
        { name: 'steamed milk', target: 55 },
        { name: 'cinnamon', target: 5 }
        ]
    },
    {
        id: 10, name: 'Iced Coffee', difficulty: 'hard',
        ingredients: [
        { name: 'espresso shot', target: 20 },
        { name: 'cold water', target: 30 },
        { name: 'ice', target: 35 },
        { name: 'milk', target: 15 }
        ]
    },
]

    function handleValidation() {
        // Error handling will go here
    }

    return <div>
        <h1>Guest Menu</h1>

        <div>
            <ul>
                {menu.map(drink => (
                    <li key={drink.id}>
                        <button type="button" onClick={() => getOrder(drink)}>{drink.name}</button>
                    </li>
                ))}             
            </ul>

            <h3>Your order is: </h3>
            <p>{guestOrder.name}</p>

            <button onClick={() => guestOrder.name != 'default' ? submitOrder() : handleValidation()}>Place order</button>
        </div>
    </div>
}