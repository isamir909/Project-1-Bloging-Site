const authorModel = require("../Models/AuthorModel");
let validator = require("validator");
let evalidator = require("email-validator");
let jwt = require("jsonwebtoken");

//written by samir
const createAuthor = async function (req, res) {
  try {
    let data = req.body;
    let { email, fname, title, lname, password } = data;
    let array1 = [email, fname, title, lname, password];
    let arrayOfString = ["email", "fname", "title", "lname", "password"];

    //if input is empty
    if (Object.keys(data).length == 0)
      return res.status(400).send({ msg: " input object can not be empty" });

    for (let i = 0; i < array1.length; i++) {
      // required field verification
      let value = arrayOfString[i];
      if (!(value in data))
        return res.status(422).send({ msg: value + " " + "is required field" });
      // status code  422 (Unprocessable Entity)

      // condition for empty fields
      if (array1[i].trim() == "")
        return res
          .status(400)
          .send({ msg: arrayOfString[i] + " " + " can not be empty" });

      //data type verification
      let type = typeof array1[i];
      if (type == "object")
        return res.status(400).send({ msg: "input data can not be null" });
      if (array1[i].toLowerCase() == "undefined")
        return res.status(400).send({ msg: "input data can not be undefined" });
    }

    // email validation
    let validate = evalidator.validate(data.email);
    if (validate == false)
      return res
        .status(400)
        .send({ msg: "You have entered an invalid email address!" });

    // name alphabatic  validation

    let LnameValidate = validator.isAlpha(data.lname);
    let FnameValidate = validator.isAlpha(data.fname);

    if (LnameValidate == false || FnameValidate == false)
      return res
        .status(400)
        .send({ err: "LastName and firstName must be between A-z or a-z " });

    if (!["Mr", "Mrs", "Miss"].includes(data.title.trim()))
      return res.status(400).send({ msg: "title must be  Mr,Mrs or Miss" });

    let savedData = await authorModel.create(data);
    res.status(201).send({ msg: savedData });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: error.message });
  }
};

//written by samir
// FOR  LOGIN
let loginauth = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;

    //if input is null
    if (typeof password == "object" || typeof email == "object")
      return res.status(400).send({ msg: "input data can not be null" });

    // if input field is empty
    if (email.trim() == "" || password.trim() == "")
      return res
        .status(400)
        .send({ msg: "email and password can not be empty" });
    // email validation
    let validate = evalidator.validate(email);
    if (validate == false)
      return res
        .status(400)
        .send({ msg: "You have entered an invalid email address!" });

    // if user not found
    let validateEmail = await authorModel.findOne({ email: email });
    if (!validateEmail) return res.status(400).send({ msg: "user not found" });

    // if password is wrong

    if (validateEmail.password != password)
      return res.status(403).send({ msg: "invalid password" });
    //403 Forbidden uch as insufficient rights to a resource.

    let key = jwt.sign(
      {
        id: validateEmail._id.toString(),
      },
      "Blog site project, team No.= 12"
    );

    res.setHeader("x-api-key", key);
    res.status(200).send({ key: key });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports.loginauth = loginauth;
module.exports.createAuthor = createAuthor;

// let email = data.email.split(" ").join("").trim();
// let password = data.password.split(" ").join("").trim();
