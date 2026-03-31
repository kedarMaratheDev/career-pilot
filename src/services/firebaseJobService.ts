import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase.config";
import type {
  JobApplication,
  JobCreateInput,
  JobStatus,
  JobUpdateInput,
} from "../features/job-tracker/types/job.types";

const JOBS_COLLECTION = "jobs";

export interface JobService {
  listByUser(userId: string): Promise<JobApplication[]>;
  listByStatus(userId: string, status: JobStatus): Promise<JobApplication[]>;
  getJobById(jobId: string): Promise<JobApplication | null>;
  createJob(userId: string, input: JobCreateInput): Promise<JobApplication>;
  updateJobDetails(
    jobId: string,
    input: JobCreateInput,
  ): Promise<JobApplication>;
  updateJob(jobId: string, updates: JobUpdateInput): Promise<JobApplication>;
  updateJobNotes(jobId: string, notes: string): Promise<JobApplication>;
  deleteJob(jobId: string): Promise<void>;
}

/**
 * Convert Firestore timestamp to ISO string
 */
const toISOString = (data: Record<string, any>, fieldName: string): string => {
  const value = data[fieldName];
  if (!value) return new Date().toISOString();
  if (typeof value === "string") return value;
  if (value.toDate) return value.toDate().toISOString();
  return new Date().toISOString();
};

/**
 * Convert Firestore document to JobApplication
 */
const docToJob = (docId: string, data: Record<string, any>): JobApplication => {
  return {
    id: docId,
    userId: data.userId,
    company: data.company,
    role: data.role,
    location: data.location,
    jobLink: data.jobLink,
    notes: data.notes,
    status: data.status,
    interviewStage: data.interviewStage,
    verdict: data.verdict,
    appliedDate: data.appliedDate,
    createdAt: toISOString(data, "createdAt"),
    updatedAt: toISOString(data, "updatedAt"),
  };
};

export const firebaseJobService: JobService = {
  async listByUser(userId: string) {
    const q = query(
      collection(db, JOBS_COLLECTION),
      where("userId", "==", userId),
      orderBy("updatedAt", "desc"),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => docToJob(doc.id, doc.data()));
  },

  async listByStatus(userId: string, status: JobStatus) {
    const q = query(
      collection(db, JOBS_COLLECTION),
      where("userId", "==", userId),
      where("status", "==", status),
      orderBy("updatedAt", "desc"),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => docToJob(doc.id, doc.data()));
  },

  async getJobById(jobId: string) {
    const docRef = doc(db, JOBS_COLLECTION, jobId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return null;
    }

    return docToJob(snapshot.id, snapshot.data());
  },

  async createJob(userId: string, input: JobCreateInput) {
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const jobData: Record<string, any> = {
      userId,
      company: input.company,
      role: input.role,
      location: input.location || null,
      jobLink: input.jobLink,
      notes: input.notes || null,
      status: input.status,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Only set these fields if they have values
    if (input.status === "interview" && input.interviewStage) {
      jobData.interviewStage = input.interviewStage;
    }

    if (input.status === "verdict" && input.verdict) {
      jobData.verdict = input.verdict;
    }

    if (
      input.status === "applied" ||
      input.status === "interview" ||
      input.status === "verdict"
    ) {
      jobData.appliedDate = new Date().toISOString().slice(0, 10);
    }

    // Use setDoc to create with custom ID
    const docRef = doc(db, JOBS_COLLECTION, jobId);
    await setDoc(docRef, jobData);

    // Fetch and return the created job
    const created = await this.getJobById(jobId);
    if (!created) {
      throw new Error("Failed to create job");
    }

    return created;
  },

  async updateJobDetails(jobId: string, input: JobCreateInput) {
    const docRef = doc(db, JOBS_COLLECTION, jobId);
    const updateData: Record<string, any> = {
      company: input.company,
      role: input.role,
      location: input.location || null,
      jobLink: input.jobLink,
      notes: input.notes || null,
      status: input.status,
      updatedAt: serverTimestamp(),
    };

    // Handle conditional fields based on status
    if (input.status === "interview" && input.interviewStage) {
      updateData.interviewStage = input.interviewStage;
    } else {
      // Remove field if status is not 'interview'
      updateData.interviewStage = null;
    }

    if (input.status === "verdict" && input.verdict) {
      updateData.verdict = input.verdict;
    } else {
      // Remove field if status is not 'verdict'
      updateData.verdict = null;
    }

    await updateDoc(docRef, updateData);

    const updated = await this.getJobById(jobId);
    if (!updated) {
      throw new Error("Failed to update job");
    }

    return updated;
  },

  async updateJob(jobId: string, updates: JobUpdateInput) {
    const docRef = doc(db, JOBS_COLLECTION, jobId);
    const updateData: Record<string, any> = {
      status: updates.status,
      updatedAt: serverTimestamp(),
    };

    // Update notes if provided
    if (updates.notes !== undefined) {
      updateData.notes = updates.notes || null;
    }

    // Handle interview stage based on status
    if (updates.status === "interview" && updates.interviewStage) {
      updateData.interviewStage = updates.interviewStage;
    } else {
      updateData.interviewStage = null;
    }

    // Handle verdict based on status
    if (updates.status === "verdict" && updates.verdict) {
      updateData.verdict = updates.verdict;
    } else {
      updateData.verdict = null;
    }

    await updateDoc(docRef, updateData);

    const updated = await this.getJobById(jobId);
    if (!updated) {
      throw new Error("Failed to update job");
    }

    return updated;
  },

  async updateJobNotes(jobId: string, notes: string) {
    const docRef = doc(db, JOBS_COLLECTION, jobId);
    const updateData: Record<string, any> = {
      notes: notes.trim() ? notes.trim() : null,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, updateData);

    const updated = await this.getJobById(jobId);
    if (!updated) {
      throw new Error("Failed to update job notes");
    }

    return updated;
  },

  async deleteJob(jobId: string) {
    const docRef = doc(db, JOBS_COLLECTION, jobId);
    await deleteDoc(docRef);
  },
};
