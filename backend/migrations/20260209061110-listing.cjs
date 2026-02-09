'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('listing', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'category',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      sub_category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sub_category',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false
      },

      currency: {
        type: Sequelize.STRING,
        allowNull: false
      },

      price: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },

      location: {
        type: Sequelize.STRING,
        allowNull: false
      },

      item_condition: {
        type: Sequelize.ENUM('New', 'Used'),
        allowNull: false
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      is_business: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      staff_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'staff',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('listing');
  }
};
