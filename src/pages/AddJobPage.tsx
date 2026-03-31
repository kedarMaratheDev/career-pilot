import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/toast/useToast'
import { JobForm } from '../features/job-tracker/components/JobForm.tsx'
import { jobService } from '../features/job-tracker/services/jobService'
import type { JobCreateInput } from '../features/job-tracker/types/job.types'
import { authService } from '../services/authService'
import './AddJobPage.css'

const DEMO_USER_ID = 'user-001'

export const AddJobPage = () => {
    const navigate = useNavigate()
    const { showToast } = useToast()

    const handleCreateJob = async (input: JobCreateInput) => {
        const currentUser = authService.getCurrentUser()
        const userId = currentUser?.id ?? DEMO_USER_ID

        await jobService.createJob(userId, input)
        showToast('Job added successfully.')
        navigate('/dashboard')
    }

    return (
        <section className="add-job-page" aria-label="Add job page">
            <header className="add-job-page__header">
                <p className="add-job-page__eyebrow">New Opportunity</p>
                <h1>Add a job to your pipeline.</h1>
                <p>
                    Capture the role link, context, and current stage so your dashboard stays
                    focused and actionable.
                </p>
            </header>

            <div className="add-job-page__panel">
                <JobForm
                    mode="create"
                    onSubmit={handleCreateJob}
                    onCancel={() => navigate('/dashboard')}
                />
            </div>
        </section>
    )
}
