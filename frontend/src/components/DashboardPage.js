import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { AppBar, Grid, Toolbar } from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import Chart from "./Chart";
import Scores from "./Scores";

const theme = createTheme();

export default function DashboardPage(props) {

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                        pr: '24px', // keep right padding when drawer closed
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
                        <Button variant="contained" sx={{ my: 1, mx: 1.5 }}>
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>
                <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
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
                            display: 'flex',
                            flexDirection: 'column',
                            height: 240,
                        }}
                        >
                            {/* <Chart /> */}
                        </Paper>
                    </Grid>
                    {/* Training scores */}
                    <Grid item xs={12} md={4} lg={3}>
                        <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 240,
                        }}
                        >
                            <Scores />
                        </Paper>
                    </Grid>
                    {/* Accuracy chart */}
                    <Grid item xs={12} md={8} lg={9}>
                        <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 240,
                        }}
                        >
                            {/* <Chart /> */}
                        </Paper>
                    </Grid>
                    </Grid>
                </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

