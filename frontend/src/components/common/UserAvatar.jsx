import { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import api from "../../api/axios";

function UserAvatar({ user, size = 36, sx = {}, ...props }) {
  const [photoUrl, setPhotoUrl] = useState(null);

  const initial = (
    user?.firstName?.[0] ??
    user?.username?.[0] ??
    user?.email?.[0] ??
    "U"
  ).toUpperCase();

  useEffect(() => {
    let active = true;
    let objectUrl = null;

    if (user?.profilePhoto) {
      api
        .get("/api/users/me/photo", { responseType: "blob" })
        .then((res) => {
          if (active && res.data) {
            objectUrl = URL.createObjectURL(res.data);
            setPhotoUrl(objectUrl);
          }
        })
        .catch(() => {
          if (active) setPhotoUrl(null);
        });
    } else {
      setPhotoUrl(null);
    }

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [user?.profilePhoto, user?.updatedAt]);

  return (
    <Avatar
      src={photoUrl || undefined}
      sx={{
        width: size,
        height: size,
        bgcolor: photoUrl ? "transparent" : (sx.bgcolor ?? "rgba(255,255,255,0.25)"),
        color: "#FFFFFF",
        fontWeight: 700,
        fontSize: Math.max(12, Math.round(size * 0.42)),
        ...sx,
      }}
      {...props}
    >
      {!photoUrl ? initial : null}
    </Avatar>
  );
}

export default UserAvatar;
