const authorModel = require("../Models/AuthorModel");
let validator = require("validator");
let evalidator = require("email-validator");
let jwt = require("jsonwebtoken");

const createAuthor = async function (req, res) {
  try {
    let data = req.body;

    // email validation
    let validate = evalidator.validate(data.email);
    //if input is empty
    if (Object.keys(data).length == 0)
      return res.status(400).send({ msg: " object can not be empty" });
    if (validate == false)
      return res
        .status(400)
        .send({ msg: "You have entered an invalid email address!" });

    // name alphabatic  validation

    let LnameValidate = validator.isAlpha(data.LastName);
    let FnameValidate = validator.isAlpha(data.firstName);

    if (LnameValidate == false || FnameValidate == false)
      return res
        .status(400)
        .send({ err: "LastName and firstName must be between A-z or a-z " });

    // required field verification
    if (
      !("password" in data) ||
      !("email" in data) ||
      !("LastName" in data) ||
      !("firstName" in data) ||
      !("title" in data)
    )
      return res.status(422).send({
        msg: "password,email,LastName,firstName,title are required fields",
      });

    // status code  422 (Unprocessable Entity)

    // condition for empty fields
    if (
      data.password.trim() == "" ||
      data.email.trim() == "" ||
      data.LastName.trim() == "" ||
      data.firstName.trim() == "" ||
      data.title.trim() == ""
    )
      return res.status(400).send({
        msg: "password,email,LastName,firstName,title can not be empty",
      });

    if (!["Mr", "Mrs", "Miss"].includes(data.title.trim()))
      return res.status(400).send({ msg: "title must be  Mr,Mrs or Miss" });

    let savedData = await authorModel.create(data);
    res.status(201).send({ msg: savedData });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports.createAuthor = createAuthor;

// FOR  LOGIN
let loginauth = async function (req, res) {
  try {
    let data = req.body;
    const { email, password } = data;

    // if input field is empty
    if (email.trim() == "" && password.trim() == "")
      return res
        .status(400)
        .send({ msg: "email and password can not be empty" });

    // if user not found
    let validateEmail = await authorModel.findOne({ email: email });
    if (!validateEmail) return res.status(400).send({ msg: "user not found" });

    // if password is wrong
    let validateAuthor = await authorModel.findOne({
      email: email,
      password: password,
    });
    if (!validateAuthor)
      return res.status(403).send({ msg: "invalid password" });
    //403 Forbidden uch as insufficient rights to a resource.

    let key = jwt.sign(
      {
        id: validateAuthor._id.toString(),
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
