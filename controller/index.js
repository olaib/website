const codeGenerator = require('uuid').v4;
const createError = require('http-errors');
const db = require('../models');

const CREATED_SUCCESSFULLY = 'Patient created successfully',
    ERROR_OCCURRED = 'An error occurred',
    EXIST_RECORD = 'This code is already in the database',
    HOME_PAGE_URL = '/', REGISTER_PAGE_URL = '/register';

exports.get = (req, res) => {
    console.log('get home')
    const {loginMsg} = req.session;
    let msg = '';
    if (loginMsg) {
        msg = loginMsg;
        req.loginMsg = null;
    }
    res.render('index', {msg: msg});
}

exports.post = (req, res) => {
    // res.redirect('/');
}

exports.getRegister = async (req, res) => {
    const {registerMsg} = req.session;
    let msg = '';
    if (registerMsg) {
        msg = registerMsg;
        req.registerMsg = null;
    }
    console.log('get register', msg)
    res.render('register', {code: await funcs.generateCode(), msg: msg});
}

exports.postRegister = async (req, res) => {
    try {
        let {firstName, lastName, age, code, gender, diseases, medicines} = req.body;
        diseases = JSON.parse(diseases);
        medicines = JSON.parse(medicines);
        console.log("==========================================", firstName,
            lastName,
            age,
            code,
            gender,
            diseases,
            medicines
        )
        funcs.checkParams(firstName, lastName, age, code, gender);
        [firstName, lastName, gender].forEach((param) => {
            param.trim().toLowerCase();
        });
        // check if this code is already in the database
        if (await funcs.existPatient(code)) {
            req.session.registerMsg = EXIST_RECORD;
            return res.redirect('/register');
        }
        await db.Patient.create({
            firstName: firstName,
            lastName: lastName,
            age: age,
            code: code,
            gender: gender,
            medicines: medicines,
            diseases: diseases,
        }).then((record) => {
            if (!record)
                throw new Error(ERROR_OCCURRED + ' while creating new patient');
        }).catch((e) => {
            throw new Error('An error occurred while creating new patient');
        });
        req.session.loginMsg = CREATED_SUCCESSFULLY;
        return res.status(200).json({message: CREATED_SUCCESSFULLY, url: HOME_PAGE_URL});
    } catch (e) {
        // if (e instanceof Sequelize.ValidationError) {
        //     return res.status(400).json({message: e.msg ?? e.message});
        // }
        const msg = e.msg ?? e.message;
        req.session.registerMsg = e.msg ?? e.message;
        return res.status(500).json({message: msg, url: REGISTER_PAGE_URL});
    }
}

const funcs = (() => {
    // get 4 code digits
    const generateCode = async () => {
        let code;
        while (true) {
            code = get4Digits();
            // check if this code is already in the database
            if (!await existPatient(code)) {
                // we found a unique code
                break;
            }
        }
        return code;
    }
    const get4Digits = () => codeGenerator().slice(0, 4);
    const existPatient = async (code) => {
        const patient = await db.Patient.findOne({where: {code}});
        return !!patient;
    }
    const checkParams = (...params) => {
        if (params.some(p => !p)) throw createError(400, 'Bad request: Missing parameters');
    }
    return {
        generateCode,
        existPatient,
        checkParams,

    }
})();
