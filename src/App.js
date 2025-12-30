import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from './main/main';
import Model from './model/model';
import View from './view/View';

function App() {

	return (
		<div className="App">
			<Router>
				<Routes>
          			<Route esact path='/main' element={<Main />}/>
          			<Route esact path='/model' element={<Model />}/>
					<Route exact path='/view/:id' element={<View />} />
          			<Route esact path='*' element={<Main />}/>
				</Routes>
			</Router>
		</div>
	);
}

export default App;

// <Route esact path='*' element={<NotFound />}/>