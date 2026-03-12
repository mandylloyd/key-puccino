import { useKeycloak } from '@react-keycloak/web';

export default function ProtectedRoute({ role, children }) {
  const { keycloak, initialized } = useKeycloak();

  // (not a valid use for suspense since it is not async)
  if (!initialized) return <div>Loading...</div>;

  // authenticated returns a boolean
  if (!keycloak.authenticated) {
    // redirect to login page
    keycloak.login();
    return null;
  }

  // use hasRealmRole to check role from JWT
  if (role && !keycloak.hasRealmRole(role)) {
    return <div>Unauthorized</div>;
  }

  return children;
}