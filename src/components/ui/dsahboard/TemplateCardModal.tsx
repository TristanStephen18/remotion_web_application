import { Box, Button, Card, CardContent, Typography } from "@mui/material";

export const ModalTemplateCard: React.FC<{
  label: string;
  description: string;
  onSelect: (template: string, description: string) => void;
  available: boolean;
  url: string;
}> = ({ label, description, onSelect, url, available }) => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        transition: "transform 0.18s, box-shadow 0.18s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
        },
        bgcolor: "background.paper",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Smaller Video Preview */}
      <Box sx={{ position: "relative", height: 120 }}>
        <img
          alt={`${label} preview`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          src={`${url}`}
        />
      </Box>

      <CardContent sx={{ p: 1.5 }}>
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          sx={{ lineHeight: 1.3 }}
        >
          {label}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: "32px",
          }}
        >
          {description}
        </Typography>

        <Button
          variant="outlined"
          size="small"
          fullWidth
          disabled={!available}
          onClick={() => {
            if (available) {
              onSelect(label, description);
            }
          }}
          sx={{
            mt: 1,
            borderRadius: "10px",
            textTransform: "none",
            fontSize: "0.75rem",
            fontWeight: 600,
            ...(available
              ? {
                  borderColor: "#d81b60",
                  color: "#d81b60",
                  "&:hover": {
                    borderColor: "#c2185b",
                    backgroundColor: "rgba(216, 27, 96, 0.04)",
                  },
                }
              : {
                  borderColor: "#bdbdbd",
                  borderStyle: "dashed",
                  color: "#9e9e9e",
                  backgroundColor: "#f5f5f5",
                  cursor: "not-allowed",
                  opacity: 0.6,
                  "&:hover": {
                    borderColor: "#bdbdbd",
                    backgroundColor: "#f5f5f5",
                  },
                }),
          }}
        >
          {available ? (
            "Select"
          ) : (
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <svg
                style={{ width: "14px", height: "14px" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Unavailable
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
