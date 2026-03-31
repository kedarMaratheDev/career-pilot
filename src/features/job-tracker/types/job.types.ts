export type JobStatus = 'potential' | 'applied' | 'interview' | 'verdict'

export type InterviewStage = 'screening' | 'technical' | 'managerial' | 'hr'

export type VerdictStatus = 'selected' | 'rejected'

export interface JobApplication {
    id: string
    userId: string
    company: string
    role: string
    location?: string
    jobLink: string
    notes?: string
    status: JobStatus
    interviewStage?: InterviewStage
    verdict?: VerdictStatus
    createdAt: string
    updatedAt: string
    appliedDate?: string
}

export interface JobUpdateInput {
    status: JobStatus
    interviewStage?: InterviewStage
    verdict?: VerdictStatus
    notes?: string
}

export interface JobCreateInput {
    company: string
    role: string
    location?: string
    jobLink: string
    notes?: string
    status: JobStatus
    interviewStage?: InterviewStage
    verdict?: VerdictStatus
}
