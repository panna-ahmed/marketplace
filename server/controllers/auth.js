import User from '../models/user';
import { hashPassword, comparePassword } from '../utils/auth';
import jwt from 'jsonwebtoken';

export const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.json({ message: 'Signout success' });
  } catch (err) {
    console.error(err);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).send('Email is required');
    if (!password) return res.status(400).send('Password is required');

    let userExist = await User.findOne({ email }).exec();
    if (!userExist) return res.status(400).send('Wrong Credential!');
    const match = await comparePassword(password, userExist.password);
    const token = jwt.sign({ _id: userExist._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    userExist.password = undefined;

    res.cookie('token', token, {
      httpOnly: true,
      //secure: true
    });

    res.json(userExist);
  } catch (err) {
    console.log(err);
    return res.status(400).send('Try again');
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name) return res.status(400).send('Name is required');
    if (!password || password.length < 6)
      return res
        .status(400)
        .send('Password is required and min 6 characters required');

    console.log('Email name valid');

    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send('Email is taken');

    const hashedPassword = await hashPassword(password);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    }).save();

    return res.json();
  } catch (err) {
    console.log(err);
    return res.status(400).send(' Password is required and min 6 character');
  }
};
