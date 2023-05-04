// (Étape 1) Import de express
var express = require("express");

// (Étape 1) Définition du router
var router = express.Router();

// Import du Contrôleur student
var muscle_controller = require("../controllers/muscle");

// (Étape 2) Ajout de la route qui permet d'ajouter un muscle
router.post("/", muscle_controller.create);

// (Étape 2) Ajout de la route qui permet d'afficher tous les muscles
router.get("/", muscle_controller.getAll);

// (Étape 2) Ajout de la route qui permet d'afficher un seul muscle grâce à son identifant
router.get("/:id", muscle_controller.getById);

// (Étape 2) Ajout de la route qui permet de modifier un seul muscle grâce à son identifant
router.put("/:id", muscle_controller.update);

// (Étape 2) Ajout de la route qui permet de supprimer un seul muscle grâce à son identifant
router.delete("/:id", muscle_controller.delete);

// (Étape 1) Export du router
module.exports = router;
