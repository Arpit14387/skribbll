import { useEffect, useRef, useState } from "react";

import "./App.css";
import { io } from "socket.io-client";
import Main from "./main.js"
import Join from "./join.js"
import {BrowserRouter, Route, Routes, Link} from "react-router-dom"

function App() {
return(
	<div className="top">
	
		<BrowserRouter>
		<Routes>
			<Route exact path="/" element={<Join/>}/>
		<Route  path="/" element={<Main/>}>
      <Route path="code" element={<Main/>} />
      <Route path=":code" element={<Main/>} />
        </Route>
		</Routes>
		</BrowserRouter>
	</div>
)
	

}

export default App;
