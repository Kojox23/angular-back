// Import du modèle muscle
var Muscle = require("../models/muscle");

// Import de express-validator
const { param, body, validationResult } = require("express-validator");

// Déterminer les règles de validation de la requête
const muscleValidationRules = () => {
  return [
    body("firstName")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("First name must be specified.")
      .isAlphanumeric()
      .withMessage("First name has non-alphanumeric characters."),

    body("lastName")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Last name must be specified.")
      .isAlphanumeric()
      .withMessage("Last name has non-alphanumeric characters."),

    body("class")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Class must be specified."),

    body("email").isEmail().withMessage("Invalid email"),

    body("dateOfBirth", "Invalid date of birth")
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate(),
  ];
};

const paramIdValidationRule = () => {
  return [
    param("id")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Id must be specified.")
      .isNumeric()
      .withMessage("Id must be a number."),
  ];
};

const bodyIdValidationRule = () => {
  return [
    body("id")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Id must be specified.")
      .isNumeric()
      .withMessage("Id must be a number."),
  ];
};

// Méthode de vérification de la conformité de la requête
const checkValidity = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(400).json({
    errors: extractedErrors,
  });
};

// Create
exports.create = [
  bodyIdValidationRule(),
  muscleValidationRules(),
  checkValidity,
  (req, res, next) => {
    // Création de la nouvelle instance de muscle à ajouter
    var muscle = new Muscle({
      _id: req.body.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      class: req.body.class,
      email: req.body.email,
      dateOfBirth: req.body.dateOfBirth,
    });

    // Ajout de muscle dans la bdd
    muscle.save(function (err) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(201).json("Muscle created successfully !");
    });
  },
];

// Read
exports.getAll = (req, res, next) => {
  Muscle.find(function (err, result) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(result);
  });
};

exports.getById = [
  paramIdValidationRule(),
  checkValidity,
  (req, res, next) => {
    Muscle.findById(req.params.id).exec(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(result);
    });
  },
];

// Update
exports.update = [
  paramIdValidationRule(),
  muscleValidationRules(),
  checkValidity,
  (req, res, next) => {
    // Création de la nouvelle instance de muscle à modifier
    var muscle = new Muscle({
      _id: req.params.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      class: req.body.class,
      email: req.body.email,
      dateOfBirth: req.body.dateOfBirth,
    });

    Muscle.findByIdAndUpdate(req.params.id, muscle, function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      if (!result) {
        res
          .status(404)
          .json("Muscle with id " + req.params.id + " is not found !");
      }
      return res.status(201).json("Muscle updated successfully !");
    });
  },
];

// Delete
exports.delete = [
  paramIdValidationRule(),
  checkValidity,
  (req, res, next) => {
    Muscle.findByIdAndRemove(req.params.id).exec(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      if (!result) {
        res
          .status(404)
          .json("Muscle with id " + req.params.id + " is not found !");
      }
      return res.status(200).json("Muscle deleted successfully !");
    });
  },
];
