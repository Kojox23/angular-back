// Import du modèle muscle
var Muscle = require("../models/muscle");

// Import de express-validator
const { param, body, validationResult } = require("express-validator");

// Déterminer les règles de validation de la requête
const muscleValidationRules = () => {
  return [
    body("muscleName")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Muscle name must be specified.")
      .isAlphanumeric()
      .withMessage("Muscle name has non-alphanumeric characters."),

    body("exercice")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("exercice name must be specified.")
      .isAlphanumeric()
      .withMessage("exercice name has non-alphanumeric characters."),
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
      muscleName: req.body.muscleName,
      exercice: req.body.exercice,
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
      muscleName: req.body.muscleName,
      exercice: req.body.exercice,
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
