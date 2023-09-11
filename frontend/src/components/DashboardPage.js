import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { AppBar, Grid, Toolbar } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';

import { createTheme, ThemeProvider } from "@mui/material/styles";

import Chart from "./Chart";
import Scores from "./Scores";

import { getCookie } from "./utils.js";

const theme = createTheme();

export default function DashboardPage(props) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    };
    fetch("/api/logout", requestOptions).then(() => {
      navigate("/");
    });
  };

  const handleFileDownload = () => {
    const requestOptions = {
        method: "GET",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
    };
    fetch('/api/download', requestOptions)
        .then(response => {
            if (response.ok) {
                return response.blob();
            } else {
                console.error('File download failed.');
            }
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `model.pth`;
            document.body.appendChild(link);
            link.click();
            // Cleanup
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error:', error);
        });
  };

  const lossChartData = {
    title: "Loss",
    training: location.state["train_loss"],
    validation: location.state["val_loss"],
  };

  const metricChartData = {
    title: location.state["task"] === "C" ? "Accuracy" : "MAE",
    training: location.state["train_metric"],
    validation: location.state["val_metric"],
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Training results
            </Typography>
            <Button
              variant="contained"
              sx={{ my: 1, mx: 1.5 }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Loss chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <Chart responseData={lossChartData} />
                </Paper>
              </Grid>
              {/* Test scores */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <Scores responseData={location.state["test_metrics"]} />
                </Paper>
              </Grid>
              {/* Metric chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <Chart responseData={metricChartData} />
                </Paper>
              </Grid>
              {/* Download Model button */}
              <Grid item xs={12} md={4} lg={3}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<DownloadIcon />}
                  onClick={handleFileDownload}
                >
                  Download Model
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
