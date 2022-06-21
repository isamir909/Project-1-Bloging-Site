const authorModel = require("../Models/AuthorModel")

const createAuthor = async function (req, res) {

    try {
        let data = req.body
        let email = data.email

        // email validation 
        function ValidateEmail(email) {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                return console.log(true)
            }
            return res.status(400).send({ msg: "You have entered an invalid email address!" })

        }
        ValidateEmail(email);

        // required field verification 
        if (!('password' in data) || !('email' in data) || !('LastName' in data) || !('firstName' in data) || !('title' in data))
            return res.status(422).send({ msg: "password,email,LastName,firstName,title are required fields" })

        // status code  422 (Unprocessable Entity) 

        // condition for empty fields 
        if (data.password.trim() == "" || data.email.trim() == "" || data.LastName.trim() == "" || data.firstName.trim() == "" || data.title.trim() == "")
            return res.status(400).send({ msg: "password,email,LastName,firstName,title can not be empty" })


        if (!(["Mr", "Mrs", "Miss"].includes(data.title.trim()))) return res.status(400).send({ msg: "title must be  Mr,Mrs or Miss" })

        let savedData = await authorModel.create(data)
        res.status(201).send({ msg: savedData })
    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}


module.exports.createAuthor = createAuthor

