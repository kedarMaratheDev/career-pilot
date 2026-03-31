import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
    INTERVIEW_STAGE_LABEL,
    JOB_STATUS_ORDER,
    JOB_STATUS_TITLE,
    VERDICT_STATUS_LABEL,
} from '../constants/job.constants'
import type {
    InterviewStage,
    JobApplication,
    JobCreateInput,
    JobStatus,
    VerdictStatus,
} from '../types/job.types'
import './JobForm.css'

interface JobFormValues {
    company: string
    role: string
    location: string
    jobLink: string
    notes: string
    status: JobStatus
    interviewStage: InterviewStage | ''
    verdict: VerdictStatus | ''
}

interface JobFormErrors {
    company?: string
    role?: string
    status?: string
    jobLink?: string
    interviewStage?: string
    verdict?: string
}

interface JobFormProps {
    mode: 'create' | 'edit'
    initialValues?: Partial<JobApplication>
    onSubmit: (input: JobCreateInput) => Promise<void>
    onCancel: () => void
}

const interviewStages = Object.keys(INTERVIEW_STAGE_LABEL) as InterviewStage[]
const verdictOptions = Object.keys(VERDICT_STATUS_LABEL) as VerdictStatus[]

const isValidUrl = (value: string) => {
    try {
        const parsed = new URL(value)
        return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
        return false
    }
}

const buildInitialState = (initialValues?: Partial<JobApplication>): JobFormValues => ({
    company: initialValues?.company ?? '',
    role: initialValues?.role ?? '',
    location: initialValues?.location ?? '',
    jobLink: initialValues?.jobLink ?? '',
    notes: initialValues?.notes ?? '',
    status: initialValues?.status ?? 'potential',
    interviewStage: initialValues?.interviewStage ?? '',
    verdict: initialValues?.verdict ?? '',
})

const validate = (values: JobFormValues): JobFormErrors => {
    const errors: JobFormErrors = {}

    if (!values.company.trim()) {
        errors.company = 'Company is required.'
    }

    if (!values.role.trim()) {
        errors.role = 'Role is required.'
    }

    if (!values.status) {
        errors.status = 'Status is required.'
    }

    if (!values.jobLink.trim()) {
        errors.jobLink = 'Job link is required.'
    } else if (!isValidUrl(values.jobLink.trim())) {
        errors.jobLink = 'Enter a valid URL (http or https).'
    }

    if (values.status === 'interview' && !values.interviewStage) {
        errors.interviewStage = 'Interview stage is required for interview status.'
    }

    if (values.status === 'verdict' && !values.verdict) {
        errors.verdict = 'Verdict is required for verdict status.'
    }

    return errors
}

export const JobForm = ({ mode, initialValues, onSubmit, onCancel }: JobFormProps) => {
    const [values, setValues] = useState<JobFormValues>(buildInitialState(initialValues))
    const [errors, setErrors] = useState<JobFormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        setValues(buildInitialState(initialValues))
        setErrors({})
    }, [initialValues])

    const submitLabel = mode === 'create' ? 'Add Job' : 'Save Changes'

    const validationSnapshot = useMemo(() => validate(values), [values])
    const isSubmitDisabled = isSubmitting || Object.keys(validationSnapshot).length > 0

    const handleStatusChange = (nextStatus: JobStatus) => {
        setValues((current) => ({
            ...current,
            status: nextStatus,
            interviewStage: nextStatus === 'interview' ? current.interviewStage : '',
            verdict: nextStatus === 'verdict' ? current.verdict : '',
        }))

        setErrors((currentErrors) => ({
            ...currentErrors,
            interviewStage: undefined,
            verdict: undefined,
        }))
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const nextErrors = validate(values)
        setErrors(nextErrors)

        if (Object.keys(nextErrors).length > 0) {
            return
        }

        const payload: JobCreateInput = {
            company: values.company.trim(),
            role: values.role.trim(),
            location: values.location.trim() || undefined,
            jobLink: values.jobLink.trim(),
            notes: values.notes.trim() || undefined,
            status: values.status,
            interviewStage:
                values.status === 'interview'
                    ? (values.interviewStage as InterviewStage)
                    : undefined,
            verdict:
                values.status === 'verdict'
                    ? (values.verdict as VerdictStatus)
                    : undefined,
        }

        setIsSubmitting(true)
        try {
            await onSubmit(payload)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form className="job-form" onSubmit={handleSubmit} noValidate>
            <div className="job-form__grid">
                <label>
                    Company
                    <input
                        value={values.company}
                        onChange={(event) => setValues((current) => ({ ...current, company: event.target.value }))}
                        placeholder="e.g. Stripe"
                        required
                    />
                    {errors.company ? <span className="job-form__error">{errors.company}</span> : null}
                </label>

                <label>
                    Role
                    <input
                        value={values.role}
                        onChange={(event) => setValues((current) => ({ ...current, role: event.target.value }))}
                        placeholder="e.g. Senior Full Stack Engineer"
                        required
                    />
                    {errors.role ? <span className="job-form__error">{errors.role}</span> : null}
                </label>

                <label>
                    Location
                    <input
                        value={values.location}
                        onChange={(event) => setValues((current) => ({ ...current, location: event.target.value }))}
                        placeholder="e.g. Remote"
                    />
                </label>

                <label>
                    Status
                    <select
                        value={values.status}
                        onChange={(event) => handleStatusChange(event.target.value as JobStatus)}
                        required
                    >
                        {JOB_STATUS_ORDER.map((status) => (
                            <option key={status} value={status}>
                                {JOB_STATUS_TITLE[status]}
                            </option>
                        ))}
                    </select>
                    {errors.status ? <span className="job-form__error">{errors.status}</span> : null}
                </label>

                <label className="job-form__full">
                    Job link
                    <input
                        type="url"
                        value={values.jobLink}
                        onChange={(event) => setValues((current) => ({ ...current, jobLink: event.target.value }))}
                        placeholder="https://www.linkedin.com/jobs/view/..."
                        required
                    />
                    {errors.jobLink ? <span className="job-form__error">{errors.jobLink}</span> : null}
                </label>

                {values.status === 'interview' ? (
                    <label>
                        Interview stage
                        <select
                            value={values.interviewStage}
                            onChange={(event) =>
                                setValues((current) => ({
                                    ...current,
                                    interviewStage: event.target.value as InterviewStage,
                                }))
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
                        {errors.interviewStage ? <span className="job-form__error">{errors.interviewStage}</span> : null}
                    </label>
                ) : null}

                {values.status === 'verdict' ? (
                    <label>
                        Verdict
                        <select
                            value={values.verdict}
                            onChange={(event) =>
                                setValues((current) => ({
                                    ...current,
                                    verdict: event.target.value as VerdictStatus,
                                }))
                            }
                            required
                        >
                            <option value="">Select verdict</option>
                            {verdictOptions.map((verdict) => (
                                <option key={verdict} value={verdict}>
                                    {VERDICT_STATUS_LABEL[verdict]}
                                </option>
                            ))}
                        </select>
                        {errors.verdict ? <span className="job-form__error">{errors.verdict}</span> : null}
                    </label>
                ) : null}

                <label className="job-form__full">
                    Notes
                    <textarea
                        value={values.notes}
                        onChange={(event) => setValues((current) => ({ ...current, notes: event.target.value }))}
                        placeholder="Add context for interview prep, compensation, referrals, or constraints."
                        rows={5}
                    />
                </label>
            </div>

            <div className="job-form__actions">
                <button type="button" className="job-form__ghost" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitDisabled}>
                    {isSubmitting ? 'Saving...' : submitLabel}
                </button>
            </div>
        </form>
    )
}
