import { getMainSessionGroupDocRef, setDoc } from "../services/firebase";
import { getSessionGroupStats } from "./sessionStats";
import _ from "lodash";

const deleteSessionDoc = (sessionGroupDocRef, sessionId) => {
  sessionGroupDocRef
    .collection("sessions")
    .doc(sessionId)
    .delete()
    .then(console.log("Deleted session doc!"));
};

const deleteSessionFromGroupDoc = async (sessionGroupDocRef, sessionId) => {
  let sessionGroup = (await sessionGroupDocRef.get()).data() || {};
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
  setDoc(sessionGroupDocRef, sessionGroup, "Session Group");
};

export default function deleteSession(sessionId, user) {
  console.log(sessionId);
  const sessionGroupDocRef = getMainSessionGroupDocRef(user);

  deleteSessionDoc(sessionGroupDocRef, sessionId);

  deleteSessionFromGroupDoc(sessionGroupDocRef, sessionId);

  console.log(sessionGroupDocRef);
}
