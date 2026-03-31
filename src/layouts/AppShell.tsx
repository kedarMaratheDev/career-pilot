import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { firebaseAuthService } from "../services/firebaseAuthService";
import type { AuthUser } from "../services/firebaseAuthService";
import "./AppShell.css";

export const AppShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChange((user) => {
      setCurrentUser(user);
      if (!user) {
        navigate("/login", { replace: true });
      }
    });

    return unsubscribe;
  }, [navigate]);

  const isDashboard = location.pathname.startsWith("/dashboard");

  const handleLogout = async () => {
    await firebaseAuthService.logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <div className="app-shell__brand">
          <span className="app-shell__brand-mark" aria-hidden="true">
            CP
          </span>
          <div>
            <p className="app-shell__title">Career Pilot</p>
            <p className="app-shell__subtitle">Job Tracking Workspace</p>
          </div>
        </div>

        <div className="app-shell__actions">
          {isDashboard ? (
            <span className="app-shell__user">
              {currentUser?.email ?? "User"}
            </span>
          ) : null}
          <button
            type="button"
            className="app-shell__button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="app-shell__content">
        <Outlet />
      </main>
    </div>
  );
};
