var models = require("../models");
var User = models.User;

User.findOne({}).then(function (data) {
    console.log(1)
})

User.findOne({}).then(function (data) {
    console.log(2)
})
console.log("321")