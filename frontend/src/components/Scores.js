import React from "react";
import Typography from "@mui/material/Typography";

import Title from "./Title";


export default function Scores({ responseData }) {

    return (
        <React.Fragment>
            <Title>Test scores</Title>
            {Object.entries(responseData).map(([key, value]) => (
                <Typography key={key} color="text" variant="h6">
                    {key}: {value}
                </Typography>
            ))}
        </React.Fragment>
    );
}
