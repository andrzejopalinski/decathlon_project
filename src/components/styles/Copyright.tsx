import { Typography } from "@mui/material";
import Link from "@mui/material/Link";
import React from "react";

interface ICopyrightProps {
  sx: { mt: number };
}

export const Copyright: React.FC<ICopyrightProps> = (
  props: ICopyrightProps
) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link
        color="inherit"
        href="https://www.researchgate.net/profile/Klaudia-Kozlowska"
      >
        K&K PhD
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};
