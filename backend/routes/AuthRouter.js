const { verifyOtp ,sendOtp} = require('../controllers/authcontroller');
const { signupValidation, loginValidation } = require('../middleware/authvalidation');

const router = require('express').Router();


//router.post('/login', loginValidation, login);
//router.post('/signup', signupValidation, signup);
router.post('/verifyotp', verifyOtp);
router.post('/sendotp', sendOtp);

module.exports = router;