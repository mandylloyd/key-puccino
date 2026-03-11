import { useKeycloak } from '@react-keycloak/web';

export default function Logout({ message, redirectPath }) {
    const { keycloak } = useKeycloak();

    return (
        <div>
            <p>{message}</p>
            <button onClick={() => keycloak.logout({ redirectUri: `http://localhost:5173${redirectPath}` })}>
                Logout
            </button>
        </div>
    );
}