import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '../components/toast/useToast'
import { JobForm } from '../features/job-tracker/components/JobForm.tsx'
import { jobService } from '../features/job-tracker/services/jobService'
import type {
    JobApplication,
    JobCreateInput,
} from '../features/job-tracker/types/job.types'
import './AddJobPage.css'

export const EditJobPage = () => {
    const navigate = useNavigate()
    const { jobId } = useParams()
    const { showToast } = useToast()

    const [job, setJob] = useState<JobApplication | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadJob = async () => {
            if (!jobId) {
                setIsLoading(false)
                return
            }

            const record = await jobService.getJobById(jobId)
            setJob(record)
            setIsLoading(false)
        }

        void loadJob()
    }, [jobId])

    const handleUpdate = async (input: JobCreateInput) => {
        if (!jobId) {
            return
        }

        await jobService.updateJobDetails(jobId, input)
        showToast('Job updated successfully.')
        navigate('/dashboard')
    }

    if (isLoading) {
        return <div className="add-job-page__loading">Loading job details...</div>
    }

    if (!job) {
        return (
            <section className="add-job-page" aria-label="Edit job page">
                <header className="add-job-page__header">
                    <p className="add-job-page__eyebrow">Edit Opportunity</p>
                    <h1>Job not found.</h1>
                    <p>The selected job does not exist anymore.</p>
                </header>
                <div className="add-job-page__panel">
                    <button
                        type="button"
                        className="add-job-page__back"
                        onClick={() => navigate('/dashboard')}
                    >
                        Back to dashboard
                    </button>
                </div>
            </section>
        )
    }

    return (
        <section className="add-job-page" aria-label="Edit job page">
            <header className="add-job-page__header">
                <p className="add-job-page__eyebrow">Edit Opportunity</p>
                <h1>Update job details.</h1>
                <p>Modify role information, stage, and context without losing pipeline history.</p>
            </header>

            <div className="add-job-page__panel">
                <JobForm
                    mode="edit"
                    initialValues={job}
                    onSubmit={handleUpdate}
                    onCancel={() => navigate('/dashboard')}
                />
            </div>
        </section>
    )
}
