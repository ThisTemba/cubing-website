import { setDoc, getDoc, doc, deleteDoc } from "@firebase/firestore";
import _ from "lodash";
import { getMainSessionGroupDocRef } from "../services/firebase";
import { getSessionGroupStats } from "./sessionStats";

const deleteSessionDoc = (sessionGroupDocRef, sessionId) => {
  const sessionDocRef = doc(sessionGroupDocRef, "sessions", sessionId);
  deleteDoc(sessionDocRef).then(console.log("Deleted session doc!"));
};

const deleteSessionFromGroupDoc = async (sessionGroupDocRef, sessionId) => {
  let sessionGroup = (await getDoc(sessionGroupDocRef)).data() || {};
  console.log("sessionGroup before", sessionGroup);

  // Prepare Data
  console.log(sessionGroup.sessions, sessionId);
  const sessions = sessionGroup.sessions.filter(
    (sesh) => sesh.id !== sessionId
  );
  const sessionGroupStats = getSessionGroupStats(sessions);
  sessionGroup = _.merge({ sessions }, sessionGroupStats);
  console.log("sessionGroup after", sessionGroup);

  // Write to sessionGroupDoc
  setDoc(sessionGroupDocRef, sessionGroup);
};

export default function deleteSession(sessionId, user) {
  console.log(sessionId);
  const sessionGroupDocRef = getMainSessionGroupDocRef(user);

  deleteSessionDoc(sessionGroupDocRef, sessionId);

  deleteSessionFromGroupDoc(sessionGroupDocRef, sessionId);

  console.log(sessionGroupDocRef);
}
