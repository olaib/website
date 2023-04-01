'use strict';
const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Patients', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            firstName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            lastName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            age: {
                type: Sequelize.STRING,
                allowNull: false
            },
            code: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            gender: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            diseases: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: [],
                get() {
                    const value = this.getDataValue('diseases');
                    return value ? JSON.parse(value) : [];
                },
                set(value) {
                    this.setDataValue('diseases', JSON.stringify(value));
                },
            },
            medicines: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: [],
                get() {
                    const value = this.getDataValue('medicines');
                    return value ? JSON.parse(value) : [];
                },
                set(value) {
                    this.setDataValue('medicines', JSON.stringify(value));
                },
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Patients');
    }
};
