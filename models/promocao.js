'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Promocao extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Promocao.hasMany(models.Compra,
        {foreignKey: 'PromocaoId', as: 'compra_promocao'});
      Promocao.belongsTo(models.Empresa,
        {foreignKey: 'EmpresaId', as: 'empresa', onDelete: 'CASCADE'});
      Promocao.belongsToMany(models.Cartao,
        {foreignKey: 'CartaoId', through: 'Compra', as:'cartao_promocao' })
    }
  }
  Promocao.init({
    EmpresaId: DataTypes.INTEGER,
    nome: DataTypes.STRING,
    descricao: DataTypes.STRING,
    validade: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Promocao',
  });
  return Promocao;
};