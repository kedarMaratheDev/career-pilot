import { mockJobApplications } from '../data/mockJobs'
import type {
    JobApplication,
    JobCreateInput,
    JobStatus,
    JobUpdateInput,
} from '../types/job.types'

export interface JobService {
    listByUser(userId: string): Promise<JobApplication[]>
    listByStatus(userId: string, status: JobStatus): Promise<JobApplication[]>
    getJobById(jobId: string): Promise<JobApplication | null>
    createJob(userId: string, input: JobCreateInput): Promise<JobApplication>
    updateJobDetails(jobId: string, input: JobCreateInput): Promise<JobApplication>
    updateJob(jobId: string, updates: JobUpdateInput): Promise<JobApplication>
    updateJobNotes(jobId: string, notes: string): Promise<JobApplication>
    deleteJob(jobId: string): Promise<void>
}

const jobStore: JobApplication[] = [...mockJobApplications]

const wait = (durationMs: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, durationMs)
    })

export const jobService: JobService = {
    async listByUser(userId: string) {
        await wait(250)
        return jobStore
            .filter((job) => job.userId === userId)
            .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
            .map((job) => ({ ...job }))
    },
    async listByStatus(userId: string, status: JobStatus) {
        await wait(200)
        return jobStore
            .filter((job) => job.userId === userId && job.status === status)
            .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
            .map((job) => ({ ...job }))
    },
    async getJobById(jobId) {
        await wait(140)
        const job = jobStore.find((item) => item.id === jobId)
        return job ? { ...job } : null
    },
    async createJob(userId, input) {
        await wait(240)

        const now = new Date().toISOString()
        const status = input.status

        const newJob: JobApplication = {
            id: `job-${crypto.randomUUID()}`,
            userId,
            company: input.company,
            role: input.role,
            location: input.location,
            jobLink: input.jobLink,
            notes: input.notes,
            status,
            interviewStage: status === 'interview' ? input.interviewStage : undefined,
            verdict: status === 'verdict' ? input.verdict : undefined,
            createdAt: now,
            updatedAt: now,
            appliedDate: status === 'applied' || status === 'interview' || status === 'verdict'
                ? new Date().toISOString().slice(0, 10)
                : undefined,
        }

        jobStore.unshift(newJob)
        return { ...newJob }
    },
    async updateJobDetails(jobId, input) {
        await wait(230)

        const targetIndex = jobStore.findIndex((job) => job.id === jobId)
        if (targetIndex === -1) {
            throw new Error('Job not found.')
        }

        const current = jobStore[targetIndex]
        const nextStatus = input.status

        const updatedJob: JobApplication = {
            ...current,
            company: input.company,
            role: input.role,
            location: input.location,
            jobLink: input.jobLink,
            notes: input.notes,
            status: nextStatus,
            interviewStage: nextStatus === 'interview' ? input.interviewStage : undefined,
            verdict: nextStatus === 'verdict' ? input.verdict : undefined,
            updatedAt: new Date().toISOString(),
        }

        jobStore[targetIndex] = updatedJob
        return { ...updatedJob }
    },
    async updateJob(jobId, updates) {
        await wait(220)

        const targetIndex = jobStore.findIndex((job) => job.id === jobId)
        if (targetIndex === -1) {
            throw new Error('Job not found.')
        }

        const current = jobStore[targetIndex]
        const nextStatus = updates.status

        const updatedJob: JobApplication = {
            ...current,
            status: nextStatus,
            updatedAt: new Date().toISOString(),
            notes: updates.notes ?? current.notes,
            interviewStage:
                nextStatus === 'interview' ? updates.interviewStage : undefined,
            verdict: nextStatus === 'verdict' ? updates.verdict : undefined,
        }

        jobStore[targetIndex] = updatedJob
        return { ...updatedJob }
    },
    async updateJobNotes(jobId, notes) {
        await wait(180)

        const targetIndex = jobStore.findIndex((job) => job.id === jobId)
        if (targetIndex === -1) {
            throw new Error('Job not found.')
        }

        const updatedJob: JobApplication = {
            ...jobStore[targetIndex],
            notes: notes.trim() ? notes.trim() : undefined,
            updatedAt: new Date().toISOString(),
        }

        jobStore[targetIndex] = updatedJob
        return { ...updatedJob }
    },
    async deleteJob(jobId) {
        await wait(180)

        const targetIndex = jobStore.findIndex((job) => job.id === jobId)
        if (targetIndex === -1) {
            throw new Error('Job not found.')
        }

        jobStore.splice(targetIndex, 1)
    },
}
