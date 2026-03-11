export default function ManagerBoard({ completedOrder }) {
    const order = completedOrder || JSON.parse(localStorage.getItem('completedOrder'));
    console.log('order', order);
    return <div>Manager Board</div>
}