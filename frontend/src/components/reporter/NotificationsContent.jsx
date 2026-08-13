import { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Avatar,
  CircularProgress,
} from "@mui/material";

import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

import { getMyNotifications, markAllRead } from "../../services/notificationService";

function getIcon(type) {
  const t = (type || "").toUpperCase();
  if (t.includes("WARN") || t.includes("ASSIGN")) return <WarningAmberRoundedIcon />;
  if (t.includes("RESOLV") || t.includes("SUCCESS")) return <CheckRoundedIcon />;
  return <InfoRoundedIcon />;
}

function getColor(type) {
  const t = (type || "").toUpperCase();
  if (t.includes("WARN") || t.includes("ASSIGN")) return "#E0A96D";
  if (t.includes("RESOLV") || t.includes("SUCCESS")) return "#4CAF50";
  return "#4F8EF7";
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function NotificationsContent() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    getMyNotifications()
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAll = async () => {
    setMarking(true);
    try {
      await markAllRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, status: "READ" }))
      );
    } catch {
      // silently fail
    } finally {
      setMarking(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 600 }}>
          All notifications
        </Typography>

        <Button
          variant="outlined"
          disabled={marking}
          onClick={handleMarkAll}
          sx={{
            color: "#FFFFFF",
            borderColor: "#555555",
            textTransform: "none",
            "&:hover": { borderColor: "#1565C0" },
          }}
        >
          Mark all read
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={28} />
        </Box>
      ) : notifications.length === 0 ? (
        <Typography sx={{ color: "#9CA3AF", textAlign: "center", py: 4 }}>
          No notifications.
        </Typography>
      ) : (
        notifications.map((item, index) => (
          <Box key={item.notificationId ?? item.id ?? index}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 2,
                opacity: item.status === "READ" ? 0.6 : 1,
              }}
            >
              {/* Left */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: getColor(item.type), width: 34, height: 34 }}>
                  {getIcon(item.type)}
                </Avatar>

                <Box>
                  <Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontSize: 16 }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 14, mt: 0.5 }}>
                    {item.message}
                  </Typography>
                </Box>
              </Box>

              {/* Right */}
              <Typography sx={{ color: "#808080", fontSize: 13, textAlign: "right", minWidth: 60 }}>
                {timeAgo(item.createdAt)}
              </Typography>
            </Box>

            {index !== notifications.length - 1 && (
              <Divider sx={{ borderColor: "#3A3A3A" }} />
            )}
          </Box>
        ))
      )}
    </Paper>
  );
}

export default NotificationsContent;