const express = require('express');
const router = express.Router();//change handler to this router
const authentication = require('../service/security/authentication');

//DB Files
const adminController = require('../controllers/adminController');
const authorisation = require('../service/security/authorisation');

//Route
router.get('/user', 
    authentication, 
    authorisation("admin"), 
    (req, res) => adminController.load_platform_users(req, res))
router.put('/user/id/:user_id', authentication, authorisation("admin"), (req, res) => adminController.update_user_profile(req, res))
router.get('/user/id/:user_id', authentication, authorisation("admin"), (req, res) => adminController.load_user_profile_by_id(req, res))

module.exports = router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJ1c2VybmFtZSI6IlRlY2giLCJhY2NvdW50X3R5cGUiOiJ1c2VyIn0sImlhdCI6MTcyNTAxOTk4NiwiZXhwIjoxNzI1MTA2Mzg2fQ.vFS6iyjZxIUYKWkf2xdd3t4ge969a9yPEAfSYRceqzQ

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJ1c2VybmFtZSI6IlRlY2giLCJhY2NvdW50X3R5cGUiOiJ1c2VyIn0sImlhdCI6MTcyNTAxOTk4NiwiZXhwIjoxNzI1MTA2Mzg2fQ.vFS6iyjZxIUYKWkf2xdd3t4ge969a9yPEAfSYRceqzQ