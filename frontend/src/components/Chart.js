import React from "react";
import { useTheme } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  Tooltip,
} from "recharts";
import Title from "./Title";


export default function Chart({ responseData }) {
  const theme = useTheme();

  const title = responseData.title;
  const data = responseData.training.map((item, index) => ({
    epoch: index + 1,
    t_v: item,
    v_v: responseData.validation[index],
  }));

  return (
    <React.Fragment>
      <Title>{title}</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="epoch"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            scale={"log"}
            domain={["auto"]}
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: "middle",
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Value
            </Label>
          </YAxis>
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="t_v"
            name="Training"
            stroke={theme.palette.primary.main}
          />
          <Line
            type="monotone"
            dataKey="v_v"
            name="Validation"
            stroke={theme.palette.secondary.main}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
