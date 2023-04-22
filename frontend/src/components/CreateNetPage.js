import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Container, Grid, TextField } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const theme = createTheme();

export default function CreateNetPage(props) {
    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
    const [inputFields, setInputFields] = useState([
        {id: uuidv4(), input: "", output: ""},
    ]);
    const [task, setTask] = useState("");
    const [optimizer, setOptimizer] = useState("");
    const [learningRate, setLearningRate] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        fetch("/api/create", {
            method: "GET",
            headers: {
                Authorization: `Token ${authToken}`,
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json())
        .then((data) => setUser(data.user))
        .catch((error) => console.error(error));
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (!validateForm()) {
                throw new Error("Layer sizes do not match!");
            }

            const authToken = localStorage.getItem('authToken');
            const formData = new FormData();
            formData.append('file', file);
            formData.append('task', task);
            formData.append('optimizer', optimizer);
            formData.append('lr', learningRate);
            formData.append('layers', inputFields);

            const requestOptions = {
                method: "POST",
                headers: {
                    Authorization: `Token ${authToken}`,
                    "enctype": "multipart/form-data",
                },
                body: {
                    file: file,
                    task: task,
                },
            }
            console.log(requestOptions["body"]);
            const response = await fetch("/api/create", requestOptions);
            if (!response.ok) {
                throw new Error("NIE JEST DOBRZE");
            }
            // window.location.href = "";
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

    const handleChangeInput = (id, event) => {
        const newInputFields = inputFields.map(i => {
            if(id === i.id) {
              i[event.target.name] = event.target.value
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

    function getFileExtension(filename) {
        const extension = filename.split('.').pop();
        return extension;
    }

    function validateFile(file) {
        if (getFileExtension(file["name"]) != "txt") {
            return false;
        }
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

    const handleTaskChange = (event) => {
        setTask(event.target.value);
    }

    const handleOptimizerChange = (event) => {
        setOptimizer(event.target.value);
    }

    const handleChangeLR = (event) => {
        setLearningRate(event.target.value);
    }

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <CssBaseline />
                <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Customize your NN
                    </Typography>
                    <Button color="inherit">
                        Logout
                    </Button>
                </Box>
                <Box sx={{marginTop: 4, display: "flex", flexDirection: "column"}}>
                    <Box component="form" noValidate enctype="multipart/form-data" onSubmit={handleSubmit}>
                        <Grid item>
                            <Button
                                variant="contained"
                                component="label"
                                onChange={(event) => handleFileUpload(event)}
                                >
                                Upload your dataset (.csv)
                                <input
                                    type="file"
                                    hidden
                                    required
                                />
                            </Button>
                        </Grid>
                        {inputFields.map(inputField => (
                            <Grid container direction={"row"} alignItems="center" key={inputField.id}>
                                <Grid item>
                                    <Typography component="h1" variant="h5">Linear</Typography>
                                </Grid>
                                <Grid itemProp="">
                                    <TextField required name="input" label="Input" type="number" variant="filled" inputProps={{min: 1,}} onChange={(event) => handleChangeInput(inputField.id, event)} />
                                </Grid>
                                <Grid item>
                                    <TextField required name="output" label="Output" type="number" variant="filled" inputProps={{min: 1,}} onChange={(event) => handleChangeInput(inputField.id, event)} />
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
                        <Grid container direction={"row"} spacing={2} alignItems={"center"}>
                            <Grid item>
                                <InputLabel>Optimizer</InputLabel>
                                <Select
                                    required
                                    value={optimizer}
                                    label="Optimizer"
                                    onChange={handleOptimizerChange}
                                >
                                    <MenuItem value={0}>SGD</MenuItem>
                                    <MenuItem value={1}>SGD + momentum</MenuItem>
                                    <MenuItem value={2}>Adam</MenuItem>
                                    <MenuItem value={3}>NAdam</MenuItem>
                                    <MenuItem value={4}>AdamW</MenuItem>
                                    <MenuItem value={5}>Adam</MenuItem>
                                    <MenuItem value={6}>RMSprop</MenuItem>
                                    <MenuItem value={7}>Adadelta</MenuItem>
                                    <MenuItem value={8}>Adagrad</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item>
                                <InputLabel>Task</InputLabel>
                                <Select
                                    required
                                    value={task}
                                    label="Task"
                                    onChange={handleTaskChange}
                                >
                                    <MenuItem value={"classification"}>Classification</MenuItem>
                                    <MenuItem value={"regression"}>Regression</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item>
                                <TextField required name="lr" label="Learning rate" type="number" variant="filled" onChange={handleChangeLR} />
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" type="submit">Train model</Button>
                        </Grid>
                        {error && (
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
