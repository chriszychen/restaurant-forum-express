const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const fs = require('fs')
const helpers = require('../_helpers.js')

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
    const sameUser = helpers.getUser(req).id === Number(req.params.id)
    return User.findByPk(req.params.id)
      .then(user => res.render('user', { user: user.toJSON(), sameUser: sameUser }))
  },

  editUser: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.id)) {
      req.flash('error_messages', 'you have no authority to edit this user\'s profile')
      return res.redirect(`/users/${req.params.id}`)
    }
    return User.findByPk(req.params.id)
      .then(user => res.render('editUser', { user: user.toJSON() }))
  },

  putUser: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.id)) {
      req.flash('error_messages', 'you have no authority to edit this user\'s profile')
      return res.redirect('back')
    }

    if (!req.body.name) {
      req.flash('error_messages', 'name is required')
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return User.findByPk(req.params.id)
            .then(user => {
              user.update({
                name: req.body.name,
                image: `/upload/${file.originalname}`
              })
            })
            .then(user => {
              req.flash('success_messages', 'user profile was successfully updated')
              res.redirect(`/users/${req.params.id}`)
            })
        })
      })
    } else {
      return User.findByPk(req.params.id)
        .then(user => {
          user.update({
            name: req.body.name,
            image: '/upload/user-icon.png'
          })
        })
        .then(user => {
          req.flash('success_messages', 'user profile was successfully updated')
          res.redirect(`/users/${req.params.id}`)
        })
    }
  }
}

module.exports = userController
