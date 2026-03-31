import { useNavigate } from "react-router-dom";
import { useToast } from "../components/toast/useToast";
import { JobForm } from "../features/job-tracker/components/JobForm.tsx";
import { firebaseJobService } from "../services/firebaseJobService";
import type { JobCreateInput } from "../features/job-tracker/types/job.types";
import { firebaseAuthService } from "../services/firebaseAuthService";
import "./AddJobPage.css";

export const AddJobPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleCreateJob = async (input: JobCreateInput) => {
    const currentUser = await firebaseAuthService.getCurrentUser();
    if (!currentUser) {
      throw new Error("Not authenticated");
    }
    await firebaseJobService.createJob(currentUser.id, input);
    showToast("Job added successfully.");
    navigate("/dashboard");
  };

  return (
    <section className="add-job-page" aria-label="Add job page">
      <header className="add-job-page__header">
        <p className="add-job-page__eyebrow">New Opportunity</p>
        <h1>Add a job to your pipeline.</h1>
        <p>
          Capture the role link, context, and current stage so your dashboard
          stays focused and actionable.
        </p>
      </header>

      <div className="add-job-page__panel">
        <JobForm
          mode="create"
          onSubmit={handleCreateJob}
          onCancel={() => navigate("/dashboard")}
        />
      </div>
    </section>
  );
};
