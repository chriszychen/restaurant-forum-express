const assert = require('assert')
const moment = require('moment')
const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const should = chai.should()
const { expect } = require('chai')

const app = require('../app')
const routes = require('../routes/index')
const db = require('../models')
const helpers = require('../_helpers');

describe('# A22: TOP 10 人氣餐廳 ', function() {
    
  context('# [網址正確、畫面正常執行]', () => {
    before(async() => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({id: 1, Followings: [], FavoritedRestaurants: []});

      await db.User.destroy({where: {},truncate: true})
      await db.Category.destroy({where: {},truncate: true})
      await db.Restaurant.destroy({where: {},truncate: true})
      await db.Favorite.destroy({where: {},truncate: true})
      await db.User.create({name: 'User1'})
      await db.User.create({name: 'User2'})
      await db.Restaurant.create({
        name: 'Restaurant1',
        tel: 'tel',
        address: 'address',
        opening_hours: 'opening_hours',
        description: 'description',
        CategoryId: 1
      })
      await db.Restaurant.create({
        name: 'Restaurant2',
        tel: 'tel',
        address: 'address',
        opening_hours: 'opening_hours',
        description: 'description',
        CategoryId: 1
      })
      await db.Favorite.create({
        UserId: 1,
        RestaurantId: 1
      })
      await db.Favorite.create({
        UserId: 1,
        RestaurantId: 2
      })
      await db.Favorite.create({
        UserId: 2,
        RestaurantId: 2
      })
    })

    it(" GET /restaurants/top ", (done) => {
        request(app)
          .get('/restaurants/top')
          .end(function(err, res) {
            res.text.indexOf('Restaurant1').should.above(res.text.indexOf('Restaurant2'))
            done()
        });
    });

    after(async () => {
      this.ensureAuthenticated.restore();
      this.getUser.restore();
      await db.User.destroy({where: {},truncate: true})
    })

  })

  context('# [當你點擊畫面上的「加入最愛 / 移除最愛」按鈕時，會重新計算「收藏數」的數字]', () => {
    before(async() => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({id: 1, Followings: [], FavoritedRestaurants: []});

      await db.User.destroy({where: {},truncate: true})
      await db.Category.destroy({where: {},truncate: true})
      await db.Restaurant.destroy({where: {},truncate: true})
      await db.Favorite.destroy({where: {},truncate: true})
      await db.User.create({name: 'User1'})
      await db.User.create({name: 'User2'})
      await db.Restaurant.create({
        name: 'Restaurant1',
        tel: 'tel',
        address: 'address',
        opening_hours: 'opening_hours',
        description: 'description',
        CategoryId: 1
      })
      await db.Restaurant.create({
        name: 'Restaurant2',
        tel: 'tel',
        address: 'address',
        opening_hours: 'opening_hours',
        description: 'description',
        CategoryId: 1
      })

    })

    it(" POST /favorite/1 ", (done) => {
        request(app)
          .post('/favorite/1')
          .end(function(err, res) {
            request(app)
              .get('/restaurants/top')
              .end(function(err, res) {
                res.text.indexOf('Restaurant2').should.above(res.text.indexOf('Restaurant1'))
                done()
            })
        })
    })

    it(" DELETE /favorite/1 ", (done) => {
        request(app)
          .delete('/favorite/1')
          .end(function(err, res) {
            request(app)
              .post('/favorite/2')
              .end(function(err, res) {
                request(app)
                  .get('/restaurants/top')
                  .end(function(err, res) {
                    res.text.indexOf('Restaurant1').should.above(res.text.indexOf('Restaurant2'))
                    done()
                })
            })
        })
    })

    after(async () => {
      this.ensureAuthenticated.restore();
      this.getUser.restore();
      await db.User.destroy({where: {},truncate: true})
    })

  })

})