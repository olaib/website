// init module
(() => {
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('add-disease').addEventListener('click', registerModule.addDisease);
        document.getElementById('add-medicine').addEventListener('click', registerModule.addMedicine);
        document.getElementById('registerForm').addEventListener('submit', registerModule.submit);
    });

})();
/***
 * register module - validate and submit form
 */
const registerModule = (() => {
    const [DISEASE_LIST, MEDICINE_LIST] = [true, false];
    let diseasesList = []
    let medicineList = []
    const show = (elem) => {
        elem.classList.remove('d-none');
    }
    const hide = (elem) => {
        elem.classList.add('d-none');
    }
    const beforeElem = (elem) => elem.previousElementSibling;
    //by css path
    const getElementFromParent = (elem, selector) => elem.parentElement.querySelector(selector);
    const getNextParentElem = (elem) => elem.parentElement.nextElementSibling;

    function addDisease(event) {
        event.preventDefault();
        const disease = getElementFromParent(event.target, 'input').value;
        const isValid = validator.isValidDisease(disease);
        addMedOrDisease(event, isValid, disease, DISEASE_LIST);
    }

    // reuse add disease or medicine function to add disease or medicine to list and hide/show error message
    function addMedOrDisease(event, isValid, item, isDiseaseList) {
        let errorElem = getNextParentElem(event.target);
        if (isValid) {
            hide(errorElem); //hide error message
            let list = isDiseaseList ? diseasesList : medicineList;
            list.push(item);
        } else {
            show(errorElem) //show error message
        }
    }

    function addMedicine(event) {
        event.preventDefault();
        const medicine = getElementFromParent(event.target, 'input').value;
        const isValid = validator.isValidMedCode(medicine);
        addMedOrDisease(event, isValid, medicine, MEDICINE_LIST);
    }

    function validate(firstName, lastName, age, gender) {
        // validate names
        [firstName, lastName].forEach((elem) => {
            if (!elem.checkValidity()) {
                elem.reportValidity();
                return false;
            } else {
                elem.setCustomValidity('');
                elem.reportValidity();
            }
        });
        // Get error elements
        const [genderError, ageError] = [gender, age].map(elem => elem.nextElementSibling);
        // validate gender
        if (validator.validateGender(gender.value)) {
            hide(genderError)
        } else {
            show(genderError)
            return false;
        }
        // validate age
        if (validator.isValidAge(age)) {
            hide(ageError)
        } else {
            show(ageError)
            return false;
        }// valid form
        return true;
    }

    function submit(event) {
        event.preventDefault();
        const form = event.target;
        const code = document.querySelector('form > p > #generatedCode').innerHTML;
        const {firstName, lastName, age, gender} = form.elements;
        if (!validate(firstName, lastName, age, gender))
            return false;
        // create form data - convert form to json
        const formData = new FormData(form);
        formData.append("code", code);
        formData.append("diseases", JSON.stringify(diseasesList));
        formData.append("medicines", JSON.stringify(medicineList));
        // send data to server
        fetch(form.action, {
            method: form.method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(Object.fromEntries(formData)),
        }).then((response) => {
            response.json().then((data) => window.location.href = data.url);
        });
    }

    return {
        addDisease,
        addMedicine,
        submit,
    }

})();

const validator = (() => {
    const AGE_REGEX = /^[0-9]{1,3}$/;
    const CODE_REGEX = /^[a-zA-Z0-9]{3,8}$/;
    const GENDERS = ['male', 'female'];
    const [MIN_MED_LEN, MAX_MED_LEN] = [3, 8];
    const [MIN_AGE, MAX_AGE] = [0, 120];
    const isValidMedCode = (code) => code && CODE_REGEX && code.length <= MAX_MED_LEN && code.length >= MIN_MED_LEN;
    const isValidDisease = (disease) => disease && disease.length > 0;
    const validateGender = (gender) => gender && (GENDERS.includes(gender));

    const isValidAge = (age) => {
        if (!age || !AGE_REGEX.test(age.value))
            return false;
        try {
            const ageNum = parseInt(age.value);
            return ageNum >= MIN_AGE && ageNum <= MAX_AGE;
        } catch (e) {
            return false;
        }
    }

    return {
        isValidMedCode: isValidMedCode,
        isValidDisease: isValidDisease,
        validateGender,
        isValidAge,
    }
})();
