import { useState, type FormEvent } from "react";
import { Modal } from "../components/Modal";
import { firebaseAuthService } from "../services/firebaseAuthService";
import "./SignupModal.css";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupSuccess: () => void;
}

interface SignupFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export const SignupModal = ({
  isOpen,
  onClose,
  onSignupSuccess,
}: SignupModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: SignupFormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await firebaseAuthService.signup(email, password);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      onSignupSuccess();
      onClose();
    } catch (error) {
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "Signup failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} title="Create Account" onClose={handleClose}>
      <div className="signup-modal">
        <p className="signup-modal__subtitle">
          Sign up for Career Pilot to start tracking your job opportunities.
        </p>

        <form onSubmit={handleSubmit} className="signup-form">
          <label className="signup-form__label">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your@example.com"
              autoComplete="email"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="signup-form__error">{errors.email}</p>
            )}
          </label>

          <label className="signup-form__label">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="signup-form__error">{errors.password}</p>
            )}
          </label>

          <label className="signup-form__label">
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <p className="signup-form__error">{errors.confirmPassword}</p>
            )}
          </label>

          {errors.general && (
            <p className="signup-form__error-general">{errors.general}</p>
          )}

          <button
            type="submit"
            className="signup-form__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </Modal>
  );
};
