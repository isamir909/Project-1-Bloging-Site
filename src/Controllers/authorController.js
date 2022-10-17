const authorModel = require("../Models/AuthorModel");
let validator = require("validator");
let eValidator = require("email-validator");
let jwt = require("jsonwebtoken");
const {isValid}=require("../validator/validations")


const createAuthor = async function (req, res) {
  try {
    let data = req.body;
    let { email, fname, title, lname, password } = data;

    //if input is empty || required fields are missing
    if (Object.keys(data).length == 0)
      return res.status(400).send({ status: false, msg: " input object can not be empty" });

    if(!isValid(email)){
      return res.status(400).send({ status: false, msg: " email is required" });
    }
    if(!isValid(fname)){
      return res.status(400).send({ status: false, msg: " fname is required" });
    }
    if(!isValid(lname)){
      return res.status(400).send({ status: false, msg: " lname is required" });
    }
    if(!isValid(title)){
      return res.status(400).send({ status: false, msg: " title is required" });
    }
    if(!isValid(password)){
      return res.status(400).send({ status: false, msg: " password is required" });
    }

    // email validation
    if (!eValidator.validate(data.email))return res.status(400).send({status: false,msg: "You have entered an invalid email address!"});

    // name alphabatic  validation 
    let LnameValidate = validator.isAlpha(data.lname);
    let FnameValidate = validator.isAlpha(data.fname);

    if (LnameValidate == false || FnameValidate == false)
      return res.status(400).send({status: false,msg: "LastName and firstName must be between A-z or a-z ",});

      // used map to reduce time complexity
      let map={"Mr":1, "Mrs":1, "Miss":1}
      if(map[title.trim()]===undefined){
        return res.status(400).send({ status: false, msg: "title must be  Mr,Mrs or Miss" });
      }
    // if (!["Mr", "Mrs", "Miss"].includes(data.title.trim()))
    //   return res.status(400).send({ status: false, msg: "title must be  Mr,Mrs or Miss" });

    let checkAuthor = await authorModel.findOne({ email: email });
    if (checkAuthor)return res.status(400).send({ status: false, msg: "this email is already in use" });
   
    let savedData = await authorModel.create(data);
    res.status(201).send({ status: true, data: savedData });

  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};


let loginAuthor = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;

   if(!isValid(email)){
    return res.status(400).send({ status: false, msg: " email is required" });
   }
   if(!isValid(password)){
    return res.status(400).send({ status: false, msg: " password is required" });
  }
    // email validation
    let validate = eValidator.validate(email.trim());
    if (validate == false)
      return res.status(400).send({status: false,msg: "You have entered an invalid email address!"});

    // if user not found
    let validateEmail = await authorModel.findOne({ email: email.trim() });
    if (!validateEmail)
      return res.status(404).send({ status: false, msg: "user not found" });

    // if password is wrong

    if (validateEmail.password != password)
      return res.status(401).send({ status: false, msg: "invalid password" });

    let key = jwt.sign(
      {
        id: validateEmail._id.toString(),
      },
      "Blog site project, team No.= 12"
    );

    res.setHeader("x-api-key", key);
    res.status(200).send({ status: true, key: key });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports = {loginAuthor,createAuthor}



