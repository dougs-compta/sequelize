'use strict';

const _ = require('lodash');
const chai = require('chai');
const expect = chai.expect;
const Support = require('../support');
const DataTypes = require('../../../lib/data-types');
const current = Support.sequelize;

describe(Support.getTestDialectTeaser('Instance'), () => {
  describe('previous', () => {
    it('should return correct previous value', () => {
      const Model = current.define('Model', {
        text: DataTypes.STRING,
        textCustom: {
          type: DataTypes.STRING,
          set(val) {
            this.setDataValue('textCustom', val);
          },
          get() {
            this.getDataValue('textCustom');
          }
        }
      });

      const instance = Model.build({ text: 'a', textCustom: 'abc' });
      expect(instance.previous('text')).to.be.not.ok;
      expect(instance.previous('textCustom')).to.be.not.ok;

      instance._previousDataValues = _.clone(instance.dataValues);

      instance.set('text', 'b');
      instance.set('textCustom', 'def');

      expect(instance.previous('text')).to.be.equal('a');
      expect(instance.previous('textCustom')).to.be.equal('abc');

      instance.set('text', 'c');
      instance.set('textCustom', 'oth');

      expect(instance.previous('text')).to.be.equal('a');
      expect(instance.previous('textCustom')).to.be.equal('abc');
    });
  });
});
