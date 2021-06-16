const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const users = require("./routes/api/user");
const restaurants = require("./routes/api/restaurant");
const meals = require("./routes/api/meal");
const orders = require("./routes/api/order");

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = process.env.MONGO_URL || require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
const routerlist = []
const routes = {
  "/api/users": users,
  "/api/restaurants": restaurants,
  "/api/meals": meals,
  "/api/orders": orders,
};
for (const key in routes) {
  if (Object.hasOwnProperty.call(routes, key)) {
    app.use(key, routes[key]);
    routes[key].stack.forEach(function (r) {
      if (r.route && r.route.path) {
          routerlist.push({ Method: Object.keys(r.route.methods)[0], Endpoint: key + r.route.path })
      }
    })
  }
}

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
console.info('=======================Route List================================')
console.table(routerlist)

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
