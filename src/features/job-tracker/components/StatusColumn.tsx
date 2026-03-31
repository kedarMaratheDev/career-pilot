import {
    JOB_STATUS_DESCRIPTION,
    JOB_STATUS_TITLE,
} from '../constants/job.constants'
import type { JobStatus, JobApplication } from '../types/job.types'
import { JobCard } from './JobCard'
import './StatusColumn.css'

interface StatusColumnProps {
    status: JobStatus
    items: JobApplication[]
    onJobSelect: (job: JobApplication) => void
    onSaveNotes: (jobId: string, notes: string) => Promise<void>
}

export const StatusColumn = ({
    status,
    items,
    onJobSelect,
    onSaveNotes,
}: StatusColumnProps) => (
    <section className="status-column" aria-label={JOB_STATUS_TITLE[status]}>
        <header className="status-column__header">
            <div>
                <h2>{JOB_STATUS_TITLE[status]}</h2>
                <p>{JOB_STATUS_DESCRIPTION[status]}</p>
            </div>
            <span className="status-column__count">{items.length}</span>
        </header>

        {items.length > 0 ? (
            <div className="status-column__list">
                {items.map((job) => (
                    <JobCard
                        key={job.id}
                        job={job}
                        onClick={onJobSelect}
                        onSaveNotes={onSaveNotes}
                    />
                ))}
            </div>
        ) : (
            <div className="status-column__empty">
                <p>No jobs in this stage yet.</p>
            </div>
        )}
    </section>
)
