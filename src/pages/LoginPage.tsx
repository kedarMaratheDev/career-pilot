import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseAuthService } from "../services/firebaseAuthService";
import { SignupModal } from "./SignupModal";
import "./LoginPage.css";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("johndoe@gmail.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await firebaseAuthService.login(email, password);
      navigate("/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Login failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-page__panel">
        <p className="login-page__eyebrow">Career Intelligence</p>
        <h1>Career Pilot</h1>
        <p className="login-page__description">
          Organize opportunities, advance interviews with clarity, and keep
          every application in one focused workspace.
        </p>
      </section>

      <section className="login-card" aria-label="Login form">
        <h2>Welcome back</h2>
        <p className="login-card__supporting">
          Use your account to continue to your dashboard.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>

          {error ? <p className="login-form__error">{error}</p> : null}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="login-card__divider">
          <span>Don't have an account?</span>
        </div>

        <button
          type="button"
          className="login-card__signup-button"
          onClick={() => setIsSignupModalOpen(true)}
        >
          Create Account
        </button>
      </section>

      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSignupSuccess={() => {
          navigate("/dashboard");
        }}
      />
    </div>
  );
};
