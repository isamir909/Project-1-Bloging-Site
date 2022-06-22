const authorModel = require("../Models/AuthorModel");
let validator = require("validator");
let evalidator = require("email-validator");

const createAuthor = async function (req, res) {
  try {
    let data = req.body;

    // email validation
    let validate = evalidator.validate(data.email);

    if (validate == false)
      return res.status(400).send({ msg: "You have entered an invalid email address!" });

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
