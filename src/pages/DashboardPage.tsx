import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/toast/useToast'
import { JOB_STATUS_ORDER } from '../features/job-tracker/constants/job.constants'
import { JobDetailsModal } from '../features/job-tracker/components/JobDetailsModal'
import { StatusColumn } from '../features/job-tracker/components/StatusColumn'
import { jobService } from '../features/job-tracker/services/jobService'
import type {
    InterviewStage,
    JobApplication,
    JobStatus,
    JobUpdateInput,
    VerdictStatus,
} from '../features/job-tracker/types/job.types'
import { authService } from '../services/authService'
import './DashboardPage.css'

const DEMO_USER_ID = 'user-001'

const createEmptyBuckets = () => ({
    potential: [],
    applied: [],
    interview: [],
    verdict: [],
}) as Record<JobStatus, JobApplication[]>

export const DashboardPage = () => {
    const navigate = useNavigate()
    const { showToast } = useToast()
    const [jobs, setJobs] = useState<JobApplication[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | JobStatus>('all')
    const [interviewStageFilter, setInterviewStageFilter] = useState<'all' | InterviewStage>('all')
    const [verdictFilter, setVerdictFilter] = useState<'all' | VerdictStatus>('all')

    useEffect(() => {
        const loadJobs = async () => {
            const currentUser = authService.getCurrentUser()
            const userId = currentUser?.id ?? DEMO_USER_ID
            const records = await jobService.listByUser(userId)
            setJobs(records)
            setIsLoading(false)
        }

        void loadJobs()
    }, [])

    const filteredJobs = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase()

        return jobs.filter((job) => {
            const matchesSearch =
                normalizedSearch.length === 0 ||
                `${job.company} ${job.role}`.toLowerCase().includes(normalizedSearch)

            const matchesStatus = statusFilter === 'all' || job.status === statusFilter
            const matchesInterviewStage =
                interviewStageFilter === 'all' || job.interviewStage === interviewStageFilter
            const matchesVerdict = verdictFilter === 'all' || job.verdict === verdictFilter

            return matchesSearch && matchesStatus && matchesInterviewStage && matchesVerdict
        })
    }, [jobs, searchTerm, statusFilter, interviewStageFilter, verdictFilter])

    const jobsByStatus = useMemo(() => {
        return filteredJobs.reduce<Record<JobStatus, JobApplication[]>>((bucket, currentJob) => {
            bucket[currentJob.status].push(currentJob)
            return bucket
        }, createEmptyBuckets())
    }, [filteredJobs])

    const selectedJob = useMemo(
        () => jobs.find((job) => job.id === selectedJobId) ?? null,
        [jobs, selectedJobId],
    )

    const handleSaveJob = async (jobId: string, updates: JobUpdateInput) => {
        const updatedJob = await jobService.updateJob(jobId, updates)

        setJobs((currentJobs) =>
            currentJobs
                .map((job) => (job.id === updatedJob.id ? updatedJob : job))
                .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
        )
        showToast('Job updated successfully.')
    }

    const handleSaveJobNotes = async (jobId: string, notes: string) => {
        const updatedJob = await jobService.updateJobNotes(jobId, notes)

        setJobs((currentJobs) =>
            currentJobs
                .map((job) => (job.id === updatedJob.id ? updatedJob : job))
                .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
        )
    }

    const handleDeleteJob = async (jobId: string) => {
        await jobService.deleteJob(jobId)

        setJobs((currentJobs) => currentJobs.filter((job) => job.id !== jobId))
        setSelectedJobId(null)
        showToast('Job deleted successfully.')
    }

    return (
        <section className="dashboard-page" aria-label="Career Pilot dashboard">
            <header className="dashboard-page__header">
                <div>
                    <p className="dashboard-page__eyebrow">Pipeline Overview</p>
                    <h1>Track every opportunity from first look to final verdict.</h1>
                </div>
                <button
                    type="button"
                    className="dashboard-page__add-button"
                    onClick={() => navigate('/jobs/new')}
                >
                    Add Job
                </button>
            </header>

            <section className="dashboard-page__filters" aria-label="Dashboard filters">
                <label>
                    Search
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search by company or role"
                    />
                </label>

                <label>
                    Status
                    <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value as 'all' | JobStatus)}
                    >
                        <option value="all">All statuses</option>
                        {JOB_STATUS_ORDER.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Interview stage
                    <select
                        value={interviewStageFilter}
                        onChange={(event) =>
                            setInterviewStageFilter(event.target.value as 'all' | InterviewStage)
                        }
                    >
                        <option value="all">All interview stages</option>
                        <option value="screening">screening</option>
                        <option value="technical">technical</option>
                        <option value="managerial">managerial</option>
                        <option value="hr">hr</option>
                    </select>
                </label>

                <label>
                    Verdict
                    <select
                        value={verdictFilter}
                        onChange={(event) => setVerdictFilter(event.target.value as 'all' | VerdictStatus)}
                    >
                        <option value="all">All verdicts</option>
                        <option value="selected">selected</option>
                        <option value="rejected">rejected</option>
                    </select>
                </label>
            </section>

            {isLoading ? (
                <div className="dashboard-page__loading">Loading applications...</div>
            ) : (
                <div className="dashboard-page__board" role="list">
                    {JOB_STATUS_ORDER.map((status) => (
                        <StatusColumn
                            key={status}
                            status={status}
                            items={jobsByStatus[status]}
                            onJobSelect={(job) => setSelectedJobId(job.id)}
                            onSaveNotes={handleSaveJobNotes}
                        />
                    ))}
                </div>
            )}

            <JobDetailsModal
                job={selectedJob}
                isOpen={Boolean(selectedJob)}
                onClose={() => setSelectedJobId(null)}
                onSave={handleSaveJob}
                onDelete={handleDeleteJob}
                onEdit={(jobId) => {
                    setSelectedJobId(null)
                    navigate(`/jobs/${jobId}/edit`)
                }}
            />
        </section>
    )
}
