import User from '../models/user';
import { hashPassword, comparePassword } from '../utils/auth';
export const register = async (req, res) => {
  try {
    console.log(req.body);
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
