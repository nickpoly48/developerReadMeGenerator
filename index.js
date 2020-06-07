const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const pdf = require("html-pdf");
const generateHTML = require('./generateHTML');
const questions = [
  {
    type: "input",
    message: "What is your Github user name?",
    name: "username"
  },
  {
    type: "list",
    message: "And what is your favorite color?",
    choices: ["green", "blue", "pink", "red"],
    name: "color"
  }
];

inquirer
  .prompt(questions)
  .then(function (prompt) {
    const queryUrl = `https://api.github.com/users/${prompt.username}`;
    
    axios.get(queryUrl).then(function (res) {

      const userInfo = {
        imgUrl: res.data.avatar_url,
        name: res.data.name,
        email: res.data.email,
        location: res.data.location,
        profile: res.data.html_url,
        blog: res.data.blog,
        bio: res.data.bio,
        repos: res.data.public_repos,
        followers: res.data.followers,
        stars: res.data.public_gists,
        following: res.data.following,
        bkgcolor: prompt.color
      }
      module.export = userInfo;

      fs.writeFile("template.html", generateHTML(userInfo), function (err) {
        if (err) {
          throw err;
        }
        writePDF();
      });
    }).catch(function (error) {
      console.log("Error: ", error);
    });
  });

function writePDF() {
  var html = fs.readFileSync('./template.html', 'utf8');
  var options = { format: 'letter' };

  pdf.create(html, options).toFile(`./devProfile.pdf`, function (err, res) {
    if (err) return console.log(err);
    console.log(res); //return file name
  });
};