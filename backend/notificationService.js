import {
    addDoc,
    collection,
    onSnapshot,
    query,
    serverTimestamp,
    where
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export async function createNotification(db, recipientId, notification) {
    if (!db || !recipientId || !notification?.title || !notification?.body) return null;
    try {
        return await addDoc(collection(db, "notifications"), {
            recipientId,
            recipientRole: notification.recipientRole || "",
            type: notification.type || "shipment",
            title: notification.title,
            body: notification.body,
            href: notification.href || "notifications.html",
            relatedId: notification.relatedId || "",
            createdAt: serverTimestamp(),
            read: false
        });
    } catch (error) {
        console.warn("Notification could not be saved:", error);
        return null;
    }
}

export function watchUserNotifications(db, userId, callback, onError = () => {}) {
    if (!db || !userId) return () => {};
    const notificationsQuery = query(
        collection(db, "notifications"),
        where("recipientId", "==", userId)
    );
    return onSnapshot(notificationsQuery, (snapshot) => callback(snapshot.docs), onError);
}
