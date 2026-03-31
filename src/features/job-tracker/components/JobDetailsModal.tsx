import { useEffect, useState, type FormEvent } from 'react'
import { Modal } from '../../../components/Modal'
import {
    INTERVIEW_STAGE_LABEL,
    JOB_STATUS_ORDER,
    JOB_STATUS_TITLE,
    VERDICT_STATUS_LABEL,
} from '../constants/job.constants'
import type {
    InterviewStage,
    JobApplication,
    JobUpdateInput,
    JobStatus,
    VerdictStatus,
} from '../types/job.types'
import './JobDetailsModal.css'

interface JobDetailsModalProps {
    job: JobApplication | null
    isOpen: boolean
    onClose: () => void
    onSave: (jobId: string, updates: JobUpdateInput) => Promise<void>
    onDelete: (jobId: string) => Promise<void>
    onEdit: (jobId: string) => void
}

const interviewStages = Object.keys(INTERVIEW_STAGE_LABEL) as InterviewStage[]
const verdictOptions = Object.keys(VERDICT_STATUS_LABEL) as VerdictStatus[]

const getJobLink = (job: JobApplication) => {
    if (job.jobLink) {
        return job.jobLink
    }

    const searchText = `${job.company} ${job.role}`.trim()
    const encodedSearch = encodeURIComponent(searchText)
    return `https://www.linkedin.com/jobs/search/?keywords=${encodedSearch}`
}

const formatDateTime = (date: string) =>
    new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(date))

export const JobDetailsModal = ({
    job,
    isOpen,
    onClose,
    onSave,
    onDelete,
    onEdit,
}: JobDetailsModalProps) => {
    const [status, setStatus] = useState<JobStatus>('potential')
    const [interviewStage, setInterviewStage] = useState<InterviewStage | ''>('')
    const [verdict, setVerdict] = useState<VerdictStatus | ''>('')
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const jobLink = job ? getJobLink(job) : ''

    useEffect(() => {
        if (!job || !isOpen) {
            return
        }

        setStatus(job.status)
        setInterviewStage(job.interviewStage ?? '')
        setVerdict(job.verdict ?? '')
        setError(null)
    }, [job, isOpen])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!job) {
            return
        }

        if (status === 'interview' && !interviewStage) {
            setError('Select an interview stage.')
            return
        }

        if (status === 'verdict' && !verdict) {
            setError('Select a verdict status.')
            return
        }

        const updates: JobUpdateInput = {
            status,
            interviewStage:
                status === 'interview' ? (interviewStage as InterviewStage) : undefined,
            verdict: status === 'verdict' ? (verdict as VerdictStatus) : undefined,
        }

        setIsSaving(true)
        setError(null)

        try {
            await onSave(job.id, updates)
            onClose()
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : 'Failed to update job.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!job) {
            return
        }

        const shouldDelete = window.confirm(
            `Delete ${job.company} - ${job.role}? This cannot be undone.`,
        )

        if (!shouldDelete) {
            return
        }

        setIsDeleting(true)
        setError(null)

        try {
            await onDelete(job.id)
            onClose()
        } catch (deleteError) {
            setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete job.')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen && Boolean(job)}
            title={job ? `${job.company} - ${job.role}` : 'Job details'}
            onClose={onClose}
        >
            {job ? (
                <div className="job-details-modal">
                    <div className="job-details-modal__meta">
                        <p><strong>Location:</strong> {job.location ?? 'Not specified'}</p>
                        <p>
                            <strong>Applied date:</strong>{' '}
                            {job.appliedDate
                                ? new Intl.DateTimeFormat('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                }).format(new Date(job.appliedDate))
                                : 'Not applied yet'}
                        </p>
                        <p><strong>Created:</strong> {formatDateTime(job.createdAt)}</p>
                        <p><strong>Updated:</strong> {formatDateTime(job.updatedAt)}</p>
                        <p>
                            <strong>Job link:</strong>{' '}
                            <a href={jobLink} target="_blank" rel="noreferrer">
                                Open job link
                            </a>
                        </p>
                        {job.notes ? (
                            <p className="job-details-modal__notes">
                                <strong>Notes:</strong> {job.notes}
                            </p>
                        ) : null}
                    </div>

                    <form className="job-details-modal__form" onSubmit={handleSubmit}>
                        <label>
                            Status
                            <select
                                value={status}
                                onChange={(event) => setStatus(event.target.value as JobStatus)}
                            >
                                {JOB_STATUS_ORDER.map((currentStatus) => (
                                    <option key={currentStatus} value={currentStatus}>
                                        {JOB_STATUS_TITLE[currentStatus]}
                                    </option>
                                ))}
                            </select>
                        </label>

                        {status === 'interview' ? (
                            <label>
                                Interview stage
                                <select
                                    value={interviewStage}
                                    onChange={(event) =>
                                        setInterviewStage(event.target.value as InterviewStage)
                                    }
                                    required
                                >
                                    <option value="">Select stage</option>
                                    {interviewStages.map((stage) => (
                                        <option key={stage} value={stage}>
                                            {INTERVIEW_STAGE_LABEL[stage]}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        ) : null}

                        {status === 'verdict' ? (
                            <label>
                                Verdict
                                <select
                                    value={verdict}
                                    onChange={(event) => setVerdict(event.target.value as VerdictStatus)}
                                    required
                                >
                                    <option value="">Select verdict</option>
                                    {verdictOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {VERDICT_STATUS_LABEL[option]}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        ) : null}

                        {error ? <p className="job-details-modal__error">{error}</p> : null}

                        <div className="job-details-modal__actions">
                            <button
                                type="button"
                                onClick={() => onEdit(job.id)}
                                className="job-details-modal__ghost"
                                disabled={isDeleting || isSaving}
                            >
                                Edit Job
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="job-details-modal__danger"
                                disabled={isDeleting || isSaving}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Job'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="job-details-modal__ghost"
                                disabled={isDeleting || isSaving}
                            >
                                Cancel
                            </button>
                            <button type="submit" disabled={isSaving || isDeleting}>
                                {isSaving ? 'Saving...' : 'Save changes'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}
        </Modal>
    )
}
