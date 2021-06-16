import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Restaurants from "./components/restaurant/Restaurants";

import "./App.css";
import Meals from "./components/meals/Meals";
import Orders from "./components/orders/Orders";
import CreateRestaurant from "./components/restaurant/CreateRestaurant";

if (localStorage.jwtToken) {
    const token = localStorage.jwtToken;
    setAuthToken(token);
    const decoded = jwt_decode(token);
    store.dispatch(setCurrentUser(decoded));
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
        store.dispatch(logoutUser());
        window.location.href = "./login";
    }
}

function App() {
    return (
        <Provider store={store}>
            <Router>
                <div className="App">
                    <Navbar />
                    <Route exact path="/" component={Landing} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/login" component={Login} />
                    <Switch>
                        <PrivateRoute exact path="/restaurants" component={Restaurants} />
                        <PrivateRoute
                            exact
                            path="/restaurants/create"
                            component={CreateRestaurant}
                        />
                        <PrivateRoute
                            exact
                            path="/restaurants/orders/:id"
                            component={Orders}
                        />
                        <PrivateRoute exact path="/restaurants/:id" component={Meals} />
                        <PrivateRoute exact path="/orders" component={Orders} />
                    </Switch>
                </div>
            </Router>
        </Provider>
    );
}

export default App;
