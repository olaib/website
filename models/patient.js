'use strict';
const NAME_MSG = 'Name must be between 3 and 20 characters long';
const NAME_REGEX = /^[a-z]{3,20}$/i;
const validateAge = (value) => {
    return value >= 0 && value <= 120
}
const {
    Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Patient extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    Patient.init({
        firstName: {
            type: DataTypes.STRING,
            validate: {
                is: {
                    len: {
                        args: NAME_REGEX,
                        msg: `First ${NAME_MSG}`,
                    }
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            validate: {
                is: {
                    is: {
                        args: NAME_REGEX,
                        msg: `Last ${NAME_MSG}`,
                    }

                }
            }
        },
        age: {
            type: DataTypes.STRING,
            validate: {
                isNumeric: {
                    args: true,
                    msg: 'Age must be a number'
                }
            }
        },
        code: {
            type: DataTypes.STRING,
            validate: {
                len: {
                    args: 4,
                    msg: 'Code must be 4 characters long'
                }
            },
        },
        gender: {
            type: DataTypes.STRING,
            validate: {
                is: {
                    args: /^(male|female)$/i,
                    msg: 'Gender must be male/female'
                }
            }
        },
        medicines: {
            type: DataTypes.JSON,
        },
        diseases: {
            type: DataTypes.JSON,
            // validate: {
            //     is: {
            //         args: /^[\w\s]+$/i,// only letters, numbers, spaces and underscores
            //         msg: 'Deases must contain only letters, numbers, spaces and underscores'
            //     }
            // },
        }
    }, {
        sequelize,
        modelName: 'Patient',
    });
    return Patient;
};
