import HttpErrors from 'http-errors';
import JWT from 'jsonwebtoken';
import validate from '../services/validate';
import { Users } from '../models';

const { JWT_SECRET } = process.env;

class UsersController {
  static register = async (req, res, next) => {
    try {
      validate(req.body, {
        firstName: 'required|string|min:3',
        lastName: 'required|string|min:3',
        age: 'required|string|min:2',
        gender: 'required|string|in:male,female',
        email: 'required|email',
        phoneNumber: 'required|string|regex:/^\\+?[1-9][0-9]{7,14}$/',
        password: 'required|string|min:6',
      });

      const {
        firstName, lastName, age, gender, email, phoneNumber, password,
      } = req.body;

      const exists = await Users.findOne({
        where: { email },
        attributes: ['id'],
      });

      if (exists) {
        throw HttpErrors(422, {
          errors: {
            error: ['email already exists'],
          },
        });
      }

      const user = await Users.create({
        firstName, lastName, age, gender, email, phoneNumber, password,
      });

      res.json({
        status: 'ok',
        message: 'you have successfully registered',
        user,
      });
    } catch (e) {
      next(e);
    }
  };

  static login = async (req, res, next) => {
    try {
      validate(req.body, {
        email: 'required|email',
        password: 'required|string',
      });
      const { email, password } = req.body;
      const user = await Users.findOne({
        where: { email },
      });
      if (!user || user.getDataValue('password') !== Users.hash(password)) {
        throw HttpErrors(403, 'wrong password or email');
      }
      const token = JWT.sign({ userId: user.id }, JWT_SECRET);
      res.json({
        status: 'ok',
        token,
        user,
      });
    } catch (e) {
      next(e);
    }
  };

  static update = async (req, res, next) => {
    try {
      validate(req.body, {
        id: 'required|numeric',
      });
      const {
        firstName, lastName, age, email, id,
      } = req.body;

      const user = await Users.update({
        firstName, lastName, age, email,
      }, {
        where: {
          id,
        },
      });
      res.json({
        status: 'ok',
        user,
      });
    } catch (e) {
      next(e);
    }
  };

  static delete = async (req, res, next) => {
    try {
      validate(req.params, {
        id: 'required|numeric',
      });

      const { id } = req.params;

      const user = await Users.destroy({
        where: {
          id,
        },
      });
      if (!user) {
        throw HttpErrors(404, 'user not exist');
      }
      res.json({
        status: 'ok',
      });
    } catch (e) {
      next(e);
    }
  };

  static accountMe = async (req, res, next) => {
    try {
      const { userId } = req;

      const user = await Users.findOne({
        where: { id: userId },
      });

      res.json({
        user,
      });
    } catch (e) {
      next(e);
    }
  };

  static account = async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log(id);
      const user = await Users.findOne({
        where: { id },
      });

      res.json({
        user,
      });
    } catch (e) {
      next(e);
    }
  };

  static list = async (req, res, next) => {
    try {
      const { s = '' } = req.query;

      const where = {};

      if (s) {
        where.$or = [
          { firstName: { $like: `%${s}%` } },
          { lastName: { $like: `%${s}%` } },
          { email: { $like: `%${s}%` } },
        ];
      }

      const users = await Users.findAll({
        where,
      });

      res.json({
        status: 'ok',
        users,
      });
    } catch (e) {
      next(e);
    }
  };
}

export default UsersController;
