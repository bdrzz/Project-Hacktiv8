import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TIME_ZONE = process.env.TIME_ZONE || "Asia/Jakarta";

function getTimeString(timeZone = TIME_ZONE) {
  const now = new Date();

  // Intl.DateTimeFormat mendukung opsi timeZone untuk format waktu berdasarkan zona waktu (IANA TZ).
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return formatter.format(now);
}

function looksLikeTimeQuestion(text = "") {
  const t = String(text).trim().toLowerCase();

  // Match utama sesuai requirement + beberapa variasi umum
  return (
    t === "what time is it?" ||
    t.includes("what time is it") ||
    t.includes("time is it") ||
    t.includes("current time") ||
    t.includes("jam berapa") ||
    t.includes("pukul berapa")
  );
}

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/chat", (req, res) => {
  const message = req.body?.message ?? "";

  if (looksLikeTimeQuestion(message)) {
    const timeStr = getTimeString();
    return res.json({ reply: `It is ${timeStr} (${TIME_ZONE}).` });
  }

  return res.json({
    reply: "Ask me: 'what time is it?'",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
