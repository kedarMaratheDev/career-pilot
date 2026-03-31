import { useEffect, useState } from 'react'
import {
    INTERVIEW_STAGE_LABEL,
    VERDICT_STATUS_LABEL,
} from '../constants/job.constants'
import type { JobApplication } from '../types/job.types'
import './JobCard.css'

interface JobCardProps {
    job: JobApplication
    onClick?: (job: JobApplication) => void
    onSaveNotes?: (jobId: string, notes: string) => Promise<void>
}

const formatDate = (date: string) =>
    new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(date))

export const JobCard = ({ job, onClick, onSaveNotes }: JobCardProps) => {
    const [notesDraft, setNotesDraft] = useState(job.notes ?? '')
    const [isSavingNotes, setIsSavingNotes] = useState(false)

    useEffect(() => {
        setNotesDraft(job.notes ?? '')
    }, [job.notes, job.id])

    const handleNotesSave = async () => {
        if (!onSaveNotes) {
            return
        }

        if ((job.notes ?? '') === notesDraft) {
            return
        }

        setIsSavingNotes(true)
        try {
            await onSaveNotes(job.id, notesDraft)
        } finally {
            setIsSavingNotes(false)
        }
    }

    return (
        <article
            className="job-card"
            role="button"
            tabIndex={0}
            onClick={() => onClick?.(job)}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onClick?.(job)
                }
            }}
        >
            <header className="job-card__header">
                <p className="job-card__company">{job.company}</p>
                <p className="job-card__role">{job.role}</p>
            </header>

            <div className="job-card__meta">
                {job.location ? <span>{job.location}</span> : null}
                {job.appliedDate ? <span>Applied {formatDate(job.appliedDate)}</span> : null}
            </div>

            <div className="job-card__badges">
                {job.interviewStage ? (
                    <span className="job-card__badge job-card__badge--stage">
                        {INTERVIEW_STAGE_LABEL[job.interviewStage]}
                    </span>
                ) : null}

                {job.verdict ? (
                    <span className={`job-card__badge job-card__badge--${job.verdict}`}>
                        {VERDICT_STATUS_LABEL[job.verdict]}
                    </span>
                ) : null}
            </div>

            <label
                className="job-card__notes-field"
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
            >
                Notes
                <textarea
                    value={notesDraft}
                    onChange={(event) => setNotesDraft(event.target.value)}
                    onBlur={() => {
                        void handleNotesSave()
                    }}
                    placeholder="Add quick notes for this role"
                    rows={3}
                />
            </label>

            {isSavingNotes ? <p className="job-card__saving">Saving notes...</p> : null}

            {job.jobLink ? (
                <a
                    className="job-card__link"
                    href={job.jobLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => {
                        event.stopPropagation()
                    }}
                >
                    View posting
                </a>
            ) : null}
        </article>
    )
}
