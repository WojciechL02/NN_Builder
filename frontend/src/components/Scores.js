import React from "react";
import Typography from "@mui/material/Typography";

import Title from "./Title";


export default function Scores() {
    return (
        <React.Fragment>
            <Title>Test scores</Title>
            <Typography color="text" variant="h6">
                Accuracy:
            </Typography>
            <Typography color="text" variant="h6">
                Precision:
            </Typography>
            <Typography color="text" variant="h6">
                Recall:
            </Typography>
            <Typography color="text" variant="h6">
                F1-score:
            </Typography>
        </React.Fragment>
    );
}
