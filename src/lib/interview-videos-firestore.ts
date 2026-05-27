import {
  addDoc,
  collection,
  getCountFromServer,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type FirestoreError,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { firestore, isFirebaseConfigured } from "@/lib/firebase";

export type InterviewVideo = {
  id: string;
  title: string;
  guestName: string;
  guestRole: string;
  type: string;
  quote: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  createdAt?: Timestamp | Date | null;
};

export type InterviewVideoInput = Omit<InterviewVideo, "id" | "createdAt">;

const interviewVideosCollection = () => {
  if (!firestore) {
    throw new Error("Firestore is not configured.");
  }

  return collection(firestore, "interviewVideos");
};

export function subscribeToInterviewVideos(
  onVideos: (videos: InterviewVideo[]) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe | null {
  if (!isFirebaseConfigured) return null;

  const videosQuery = query(interviewVideosCollection(), orderBy("createdAt", "desc"));

  return onSnapshot(
    videosQuery,
    (snapshot) => {
      onVideos(
        snapshot.docs.map((videoDoc) => {
          const data = videoDoc.data();

          return {
            id: videoDoc.id,
            title: String(data.title ?? ""),
            guestName: String(data.guestName ?? ""),
            guestRole: String(data.guestRole ?? ""),
            type: String(data.type ?? "Interview"),
            quote: String(data.quote ?? ""),
            description: String(data.description ?? ""),
            videoUrl: String(data.videoUrl ?? ""),
            thumbnailUrl: String(data.thumbnailUrl ?? ""),
            duration: String(data.duration ?? ""),
            createdAt: data.createdAt ?? null,
          };
        }),
      );
    },
    onError,
  );
}

export function createInterviewVideo(input: InterviewVideoInput) {
  return addDoc(interviewVideosCollection(), {
    ...input,
    createdAt: serverTimestamp(),
  });
}

export async function getUsersCount() {
  if (!firestore) return null;

  const snapshot = await getCountFromServer(collection(firestore, "users"));
  return snapshot.data().count;
}
