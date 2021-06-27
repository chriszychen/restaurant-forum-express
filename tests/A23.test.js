const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const should = chai.should()

const app = require('../app')
const routes = require('../routes/index')
const db = require('../models')
const helpers = require('../_helpers');

describe('# A23: 【選修】更新 User Profile ', function() {
    
  context('# [瀏覽編輯 Profile 頁面]', () => {
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
      await db.Favorite.destroy({where: {},truncate: true})
      await db.Comment.destroy({where: {},truncate: true})
      await db.User.create({name: 'User1'})
      await db.User.create({name: 'User1'})
      await db.User.create({name: 'User2'})
      await db.Category.create({
        name: 'name'
      })
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
      await db.Followship.create({
        followerId: 1,
        followingId: 2
      })
    })

    it(" GET /users/:id ", (done) => {
        request(app)
          .get('/users/1')
          .end(function(err, res) {
            db.User.findByPk(1).then(user => {
              res.text.should.include('<strong>0</strong> 已評論餐廳')
              res.text.should.include('<strong>2</strong> 收藏的餐廳')
              res.text.should.include('<strong>1</strong> followings')
              res.text.should.include('<strong>0</strong> followers')
              return done();
            })
        });
    });

    after(async () => {
      this.ensureAuthenticated.restore();
      this.getUser.restore();
      await db.User.destroy({where: {},truncate: true})
    })

  })

})