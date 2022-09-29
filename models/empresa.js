'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Empresa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Empresa.hasMany(models.Promocao,
        {foreignKey: 'EmpresaId', as: 'promocao_empresa'});
    }
  }
  Empresa.init({
    nome: DataTypes.STRING,
    dataAdesao: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Empresa',
  });
  return Empresa;
};