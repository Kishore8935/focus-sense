import Session from "../models/Session.model.js";

// Start session
export const startSession = async (req, res) => {
  const session = await Session.create({});
  res.status(201).json(session);
};

// Update session
export const updateSession = async (req, res) => {
  const { sessionId, focused, distracted, away } = req.body;

  const session = await Session.findById(sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  session.focusedTime += focused || 0;
  session.distractedTime += distracted || 0;
  session.awayTime += away || 0;

  await session.save();
  res.json({ success: true });
};

// End session
export const endSession = async (req, res) => {
  const { sessionId } = req.body;

  const session = await Session.findById(sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  session.endTime = new Date();

  const total =
    session.focusedTime +
    session.distractedTime +
    session.awayTime;

  session.focusPercentage =
    total === 0 ? 0 : Math.round((session.focusedTime / total) * 100);

  await session.save();
  res.json(session);
};

export const getSessionById = async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }
  res.json(session);
};

