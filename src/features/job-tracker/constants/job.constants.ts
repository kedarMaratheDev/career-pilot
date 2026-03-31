import type { InterviewStage, JobStatus, VerdictStatus } from '../types/job.types'

export const JOB_STATUS_ORDER: JobStatus[] = [
    'potential',
    'applied',
    'interview',
    'verdict',
]

export const JOB_STATUS_TITLE: Record<JobStatus, string> = {
    potential: 'Potential',
    applied: 'Applied',
    interview: 'Interview',
    verdict: 'Verdict',
}

export const JOB_STATUS_DESCRIPTION: Record<JobStatus, string> = {
    potential: 'Jobs you are evaluating',
    applied: 'Applications sent and awaiting response',
    interview: 'Active interview pipeline',
    verdict: 'Final hiring outcomes',
}

export const INTERVIEW_STAGE_LABEL: Record<InterviewStage, string> = {
    screening: 'Screening',
    technical: 'Technical',
    managerial: 'Managerial',
    hr: 'HR',
}

export const VERDICT_STATUS_LABEL: Record<VerdictStatus, string> = {
    selected: 'Selected',
    rejected: 'Rejected',
}
