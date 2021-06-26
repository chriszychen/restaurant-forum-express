const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次輸入密碼不同！')
      res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
        .catch(err => console.log(err))
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    const sameUser = req.user.id === Number(req.params.id)
    return User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: [Restaurant] }
      ]
    })
      .then(user => {
        res.render('user', { user: user.toJSON(), sameUser: sameUser })
      })
  },

  editUser: (req, res) => {
    if (req.user.id !== Number(req.params.id)) {
      req.flash('error_messages', 'you have no authority to edit this user\'s profile')
      return res.redirect(`/users/${req.params.id}`)
    }
    return User.findByPk(req.params.id)
      .then(user => res.render('editUser', { user: user.toJSON() }))
  },

  putUser: (req, res) => {
    if (req.user.id !== Number(req.params.id)) {
      req.flash('error_messages', 'you have no authority to edit this user\'s profile')
      return res.redirect('back')
    }

    if (!req.body.name) {
      req.flash('error_messages', 'name is required')
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) return console.log(err)
        return User.findByPk(req.params.id)
          .then(user => {
            user.update({
              name: req.body.name,
              image: img.data.link
            })
          })
          .then(user => {
            req.flash('success_messages', 'user profile was successfully updated')
            res.redirect(`/users/${req.params.id}`)
          })
      })
    } else {
      return User.findByPk(req.params.id)
        .then(user => {
          user.update({
            name: req.body.name,
            image: user.image || 'https://i.imgur.com/oU19cYa.png'
          })
        })
        .then(user => {
          req.flash('success_messages', 'user profile was successfully updated')
          res.redirect(`/users/${req.params.id}`)
        })
    }
  },
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then(favorite => {
        return res.redirect('back')
      })
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then(favorite => {
        return favorite.destroy()
          .then(fav => {
            return res.redirect('back')
          })
      })
  },
  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then(like => {
        return res.redirect('back')
      })
  },
  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then(like => {
        return like.destroy()
          .then(like => {
            return res.redirect('back')
          })
      })
  },
  getTopUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    })
      .then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          FollowerCount: user.Followers.length,
          isFollowed: req.user.Followings.map(f => f.id).includes(user.id)
        }))
        users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
        return res.render('topUser', { users: users })
      })
  }
}

module.exports = userController
