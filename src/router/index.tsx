import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "../layouts/AppShell";
import { AddJobPage } from "../pages/AddJobPage";
import { DashboardPage } from "../pages/DashboardPage";
import { EditJobPage } from "../pages/EditJobPage";
import { LoginPage } from "../pages/LoginPage";
import { firebaseAuthService } from "../services/firebaseAuthService";

const authLoader = async () => {
  const user = await firebaseAuthService.getCurrentUser();
  if (!user) {
    return null;
  }
  return user;
};

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <AppShell />,
    loader: authLoader,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: "/jobs/new",
    element: <AppShell />,
    loader: authLoader,
    children: [
      {
        index: true,
        element: <AddJobPage />,
      },
    ],
  },
  {
    path: "/jobs/:jobId/edit",
    element: <AppShell />,
    loader: authLoader,
    children: [
      {
        index: true,
        element: <EditJobPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
