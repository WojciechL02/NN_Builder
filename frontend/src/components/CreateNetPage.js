import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppBar, GlobalStyles, Grid, TextField, Toolbar } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { getCookie, handleLogout } from './utils.js';

const theme = createTheme();

export default function CreateNetPage(props) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
    const [trainingSize, setTrainingSize] = useState(0);
    const [inputFields, setInputFields] = useState([
        {id: uuidv4(), input: 0, output: 0},
    ]);
    const [epochs, setEpochs] = useState(0);
    const [loss, setLoss] = useState(0);
    const [optimizer, setOptimizer] = useState(0);
    const [learningRate, setLearningRate] = useState(0);
    const [weightDecay, setWeightDecay] = useState(0);
    const [batch, setBatch] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("/api/create", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            if (!response.ok) {
                navigate("/");
            }
            return response.json();
        })
        .then((data) => setUser(data.user))
        .catch((error) => console.log(error));
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (!validateForm()) {
                throw new Error("Layer sizes do not match!");
            }

            await uploadFile();

            await sendForm();

            await startTraining();

        } catch(err) {
            setError(err.message);
        }
    }

    const startTraining = () => {
        try {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'X-CSRFToken': getCookie("csrftoken"),
                },
                body: JSON.stringify({}),
            }
            return fetch("/api/train", requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Incorrect form data!");
                }
                return response.json();
            })
            .then((data) => {
                navigate("/dashboard", { state: data });
            });

        } catch(err) {
            setError(err.message);
        }
    }

    const validateForm = () => {
        for (const key in inputFields) {
            if (key != 0) {
                if (inputFields[key-1]["output"] != inputFields[key]["input"]) {
                    return false;
                }
            }
        }
        return true;
    }

    const uploadFile = () => {
        const formData = new FormData();
        formData.append('file', file);

        const requestOptions = {
            method: "POST",
            headers: {
                'X-CSRFToken': getCookie("csrftoken"),
            },
            body: formData,
        }
        return fetch("/api/upload", requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Wrong file!");
            }
        });
    }

    const sendForm = () => {

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'X-CSRFToken': getCookie("csrftoken"),
            },
            body: JSON.stringify({
                training_size: trainingSize,
                loss: loss,
                optimizer: optimizer,
                lr: learningRate,
                wd: weightDecay,
                epochs: epochs,
                batch: batch,
                layers: inputFields,
            }),
        }
        return fetch("/api/create", requestOptions)
        .then((response) => {
            if (!response.ok) {
                console.log(response.body);
                console.log("PROBLEM");
                throw new Error("Incorrect form data!");
            }
        });
    }

    const handleChangeInput = (id, event) => {
        const newInputFields = inputFields.map(i => {
            if(id === i.id) {
              i[event.target.name] = parseInt(event.target.value)
            }
            return i;
          })
          setInputFields(newInputFields);
    }

    const handleRemoveLayer = id => {
        const values  = [...inputFields];
        values.splice(values.findIndex(value => value.id === id), 1);
        setInputFields(values);
    }

    const handleAddLayer = () => {
        setInputFields([...inputFields, {id: uuidv4(), input: "", output: ""}]);
    }

    function validateFile(file) {
        if (file["size"] > 2000000) {
            return false;
        }
        return true;
    }

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (validateFile(file)) {
            setFile(file);
        } else {
            setError("Dangerous or too big file!");
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
            <CssBaseline />
            <AppBar
                position="static"
                color="default"
                elevation={0}
                sx={{ borderBottom: (theme) => `1px solid &{theme.palette.divider}` }}
            >
                <Toolbar sx={{ flexWrap: "wrap" }}>
                    <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                        NN Builder
                    </Typography>
                    <Button variant="outlined" sx={{ my: 1, mx: 1.5 }} onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Grid container spacing={2}>
                <Grid item xs>
                    <Box
                        sx={{
                            marginTop: 8,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Dataset:
                        </Typography>
                        <Box sx={{ mt: 3 }}>
                            <Button
                                variant="contained"
                                component="label"
                                onChange={(event) => handleFileUpload(event)}
                                >
                                Choose a file
                                <input
                                    type="file"
                                    accept=".csv"
                                    hidden
                                    required
                                />
                            </Button>
                        </Box>
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h5" fontSize={14} align="left" color="text.secondary" component="div">
                                <li>File type must be .csv</li>
                                <li>Max file size is 2MB</li>
                                <li>Target variable must be named "target".</li>
                                <li>There should be a header with the column names.</li>
                                <li>There can be no missing values (NaN)!</li>
                                <li>All data should be numeric.</li>
                                <li>Data should be scaled/normalized.</li>
                                <li>If it is a classification task, "target" should be mapped to [0...n] values.</li>
                            </Typography>
                            <Grid item>
                                <TextField required style={{ width: 150 }} name="t_size" label="Training size" type="number" inputProps={{min: 0,}} variant="filled" onChange={(event) => setTrainingSize(parseFloat(event.target.value))} />
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box
                        sx={{
                            marginTop: 8,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Network parameters:
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            {inputFields.map(inputField => (
                                <Grid container item direction={"row"} alignItems="center" key={inputField.id} spacing={1}>
                                    <Grid item>
                                        <Typography component="h1" variant="h6">Linear</Typography>
                                    </Grid>
                                    <Grid item>
                                        <TextField required style={{ width: 100 }} name="input" label="Input" type="number" variant="filled" inputProps={{min: 1,}} onChange={(event) => handleChangeInput(inputField.id, event)} />
                                    </Grid>
                                    <Grid item>
                                        <TextField required style={{ width: 100 }} name="output" label="Output" type="number" variant="filled" inputProps={{min: 1,}} onChange={(event) => handleChangeInput(inputField.id, event)} />
                                    </Grid>
                                    <Grid item>
                                        <IconButton disabled={inputFields.length === 1} onClick={() => handleRemoveLayer(inputField.id)}>
                                            <RemoveCircleOutlineIcon />
                                        </IconButton>
                                    </Grid>
                                    <Grid item>
                                        <IconButton onClick={() => handleAddLayer()}>
                                            <AddCircleOutlineIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                            <Button variant="contained" color="primary" type="submit">
                                Start training
                            </Button>
                            {error && (
                                <Typography color="error" variant="body2">
                                    {error}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs>
                    <Box
                        sx={{
                            marginTop: 8,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Training settings:
                        </Typography>
                        <Box sx={{ mt: 3 }}>
                            <Grid container direction={"column"} spacing={2} alignItems={"center"}>
                                <Grid item>
                                    <InputLabel>Loss function</InputLabel>
                                    <Select
                                        required
                                        value={loss}
                                        label="Loss"
                                        style={{ width: 180 }}
                                        onChange={(event) => setLoss(parseInt(event.target.value))}
                                    >
                                        <MenuItem value={0}>CrossEntropy</MenuItem>
                                        <MenuItem value={1}>MSE</MenuItem>
                                        <MenuItem value={2}>MAE</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item>
                                    <InputLabel>Optimizer</InputLabel>
                                    <Select
                                        required
                                        value={optimizer}
                                        label="Optimizer"
                                        style={{ width: 180 }}
                                        onChange={(event) => setOptimizer(parseInt(event.target.value))}
                                    >
                                        <MenuItem value={0}>SGD</MenuItem>
                                        <MenuItem value={1}>SGD + momentum</MenuItem>
                                        <MenuItem value={2}>Adam</MenuItem>
                                        <MenuItem value={3}>NAdam</MenuItem>
                                        <MenuItem value={4}>RMSprop</MenuItem>
                                        <MenuItem value={5}>Adadelta</MenuItem>
                                        <MenuItem value={6}>Adagrad</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item>
                                    <TextField required style={{ width: 150 }} name="lr" label="Learning rate" type="number" inputProps={{min: 0,}} variant="filled" onChange={(event) => setLearningRate(parseFloat(event.target.value))} />
                                </Grid>
                                <Grid item>
                                    <TextField required style={{ width: 150 }} name="wd" label="Weight decay" type="number" inputProps={{min: 0,}} variant="filled" onChange={(event) => setWeightDecay(parseFloat(event.target.value))} />
                                </Grid>
                                <Grid item>
                                    <TextField required style={{ width: 150 }} name="epochs" label="Epochs" type="number" inputProps={{min: 1,}} variant="filled" onChange={(event) => setEpochs(parseInt(event.target.value))} />
                                </Grid>
                                <Grid item>
                                    <TextField required style={{ width: 150 }} name="batch" label="Batch size" type="number" inputProps={{min: 1,}} variant="filled" onChange={(event) => setBatch(parseInt(event.target.value))} />
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}
