// import React, { Component } from "react";
// import { render } from "react-dom";

// export default class App extends Component {
//     constructor(props) {
//         super(props);
//     }

//     render() {
//         return (
//             <h1>Testing React Code</h1>
//         );
//     }
// }

// const appDiv = document.getElementById("app");
// render(<App />, appDiv);

import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";

export default function App(props) {
    return (
        <div className="center">
            <HomePage />
        </div>
    );
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
