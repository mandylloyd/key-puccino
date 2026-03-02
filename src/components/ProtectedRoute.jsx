// this hook returns keycloak and initialized
import { useKeycloak } from '@react-keycloak/web';

export default function ProtectedRoute({ role, children }) {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) return <div>Loading...</div>;

  // keycloak.authenticated returns a boolean
  if (!keycloak.authenticated) {
    // keycloak.login redirects to login page
    keycloak.login();
    return null;
  }

  // keycloak.hasRealmRole checks roles from json web token (JWT)
  if (role && !keycloak.hasRealmRole(role)) {
    return <div>Unauthorized</div>;
  }

  return children;
}