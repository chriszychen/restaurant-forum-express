const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const should = chai.should()

const app = require('../app')
const routes = require('../routes/index')
const db = require('../models')
const helpers = require('../_helpers');

describe('# A20: 餐廳資訊整理：Dashboard', function() {
    
  context('# [Q1: Dashboard - 1 - controller / view / route]', () => {
    before(async() => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({id: 1, Followings: []});

      await db.User.destroy({where: {},truncate: true})
      await db.Category.destroy({where: {},truncate: true})
      await db.Restaurant.destroy({where: {},truncate: true})
      await db.User.create({name: 'User1'})
      await db.Category.create({
        name: 'name'
      })
      await db.Restaurant.create({
        name: 'name',
        tel: 'tel',
        address: 'address',
        opening_hours: 'opening_hours',
        description: 'description',
        CategoryId: 1
      })
    })

    it(" GET /restaurants/:id/dashboard ", (done) => {
        request(app)
          .get('/restaurants/1/dashboard')
          .end(function(err, res) {
            res.text.should.include(0)
            done()
        });
    });

    after(async () => {
      this.ensureAuthenticated.restore();
      this.getUser.restore();
      await db.User.destroy({where: {},truncate: true})
      await db.Category.destroy({where: {},truncate: true})
      await db.Restaurant.destroy({where: {},truncate: true})
    })

  })

  context('# [Q2: Dashboard - 2 - 計算瀏覽次數]', () => {
    before(async() => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({id: 1, Followings: []});

      await db.User.destroy({where: {},truncate: true})
      await db.Category.destroy({where: {},truncate: true})
      await db.Restaurant.destroy({where: {},truncate: true})
      await db.User.create({name: 'User1'})
      await db.Category.create({
        name: 'name'
      })
      await db.Restaurant.create({
        name: 'name',
        tel: 'tel',
        address: 'address',
        opening_hours: 'opening_hours',
        description: 'description',
        CategoryId: 1,
        viewCounts: 100,
      })
    })

    it(" GET /restaurants/:id/dashboard ", (done) => {
        request(app)
          .get('/restaurants/1/dashboard')
          .end(function(err, res) {
            res.text.should.include(100)
            done()
        });
    });

    after(async () => {
      this.ensureAuthenticated.restore();
      this.getUser.restore();
      await db.User.destroy({where: {},truncate: true})
      await db.Category.destroy({where: {},truncate: true})
      await db.Restaurant.destroy({where: {},truncate: true})
    })

  })

})