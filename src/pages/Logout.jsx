import { useKeycloak } from '@react-keycloak/web';

export default function Logout({ guestOrder }) {
    const { keycloak } = useKeycloak();

    return <div>
        <p>Your {guestOrder.name} order has been placed. Thank you!</p>
        <p>Select the logout button below and come back as your barista to more forward.</p>
        <button onClick={() => keycloak.logout({ redirectUri: 'http://localhost:5173/barista' })}>Logout</button>
    </div>
}