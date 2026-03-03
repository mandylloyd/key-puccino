export default function GuestMenu({ getOrder, guestOrder, submitOrder }) {
    const menu = [
        { id: 1, name: 'Espresso', ingredients: ['espresso shot'] },
        { id: 2, name: 'Americano', ingredients: ['espresso shot', 'hot water'] },
        { id: 3, name: 'Latte', ingredients: ['espresso shot', 'steamed milk', 'milk foam'] },
        { id: 4, name: 'Cappuccino', ingredients: ['espresso shot', 'steamed milk', 'thick foam'] },
        { id: 5, name: 'Mocha', ingredients: ['espresso shot', 'chocolate syrup', 'steamed milk', 'whipped cream'] },
        { id: 6, name: 'Flat White', ingredients: ['espresso shot', 'steamed milk'] },
        { id: 7, name: 'Macchiato', ingredients: ['espresso shot', 'milk foam', 'caramel drizzle'] },
        { id: 8, name: 'Vanilla Latte', ingredients: ['espresso shot', 'vanilla syrup', 'steamed milk', 'milk foam'] },
        { id: 9, name: 'Iced Coffee', ingredients: ['espresso shot', 'cold water', 'ice', 'milk'] },
        { id: 10, name: 'Chai Latte', ingredients: ['chai concentrate', 'steamed milk', 'cinnamon'] },
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