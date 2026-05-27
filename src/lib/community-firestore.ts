import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type FirestoreError,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { getDisplayName, getInitials } from "@/lib/auth";
import { firestore, isFirebaseConfigured } from "@/lib/firebase";

export type CommunityComment = {
  userId: string;
  author: string;
  text: string;
  createdAt?: Timestamp | Date | null;
};

export type CommunityPost = {
  id: string;
  userId: string;
  author: string;
  initials: string;
  title: string;
  body: string;
  tag: string;
  likes: number;
  liked: boolean;
  likedBy: string[];
  comments: CommunityComment[];
  createdAt?: Timestamp | Date | null;
};

export type CommunityPostInput = {
  title: string;
  body: string;
  tag: string;
};

const postsCollection = () => {
  if (!firestore) {
    throw new Error("Firestore is not configured.");
  }

  return collection(firestore, "communityPosts");
};

export function subscribeToCommunityPosts(
  currentUserId: string | null,
  onPosts: (posts: CommunityPost[]) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe | null {
  if (!isFirebaseConfigured) return null;

  const postsQuery = query(postsCollection(), orderBy("createdAt", "desc"));

  return onSnapshot(
    postsQuery,
    (snapshot) => {
      onPosts(
        snapshot.docs.map((postDoc) => {
          const data = postDoc.data();
          const likedBy = Array.isArray(data.likedBy) ? data.likedBy.map(String) : [];

          return {
            id: postDoc.id,
            userId: String(data.userId ?? ""),
            author: String(data.author ?? "Community Member"),
            initials: String(data.initials ?? "CM"),
            title: String(data.title ?? ""),
            body: String(data.body ?? ""),
            tag: String(data.tag ?? "Discussion"),
            likes: Number(data.likes ?? 0),
            liked: currentUserId ? likedBy.includes(currentUserId) : false,
            likedBy,
            comments: Array.isArray(data.comments) ? data.comments : [],
            createdAt: data.createdAt ?? null,
          };
        }),
      );
    },
    onError,
  );
}

export function createCommunityPost(input: CommunityPostInput, user: User) {
  const author = getDisplayName(user);

  return addDoc(postsCollection(), {
    userId: user.uid,
    author,
    initials: getInitials(author),
    title: input.title,
    body: input.body,
    tag: input.tag,
    likes: 0,
    likedBy: [],
    comments: [],
    createdAt: serverTimestamp(),
  });
}

export function updateCommunityLike(postId: string, userId: string, liked: boolean) {
  return updateDoc(doc(postsCollection(), postId), {
    likes: increment(liked ? 1 : -1),
    likedBy: liked ? arrayUnion(userId) : arrayRemove(userId),
  });
}

export function createCommunityComment(postId: string, text: string, user: User) {
  const author = getDisplayName(user);

  return updateDoc(doc(postsCollection(), postId), {
    comments: arrayUnion({
      userId: user.uid,
      author,
      text,
      createdAt: new Date(),
    }),
  });
}
