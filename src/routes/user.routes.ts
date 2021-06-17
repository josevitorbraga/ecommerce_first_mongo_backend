import { Router } from 'express';
import { hashSync, compareSync } from 'bcrypt';

import User from '../models/User';
import { generateToken, isAuth } from '../utils/utils';

const userRoutes = Router();

userRoutes.post('/register', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const newUser = new User({
      name,
      email,
      password: hashSync(password, 8),
    });

    await newUser.save();

    return response.json(newUser);
  } catch (err) {
    return response.json({ error: err.message });
  }
});

userRoutes.post('/signin', async (request, response) => {
  try {
    const { email, password } = request.body;
    const user = await User.findOne({ email });
    if (user) {
      if (compareSync(password, user.password)) {
        return response.json({
          _id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
      }
    }
    return response.status(401).json({ error: 'Email ou senha inválidos' });
  } catch (err) {
    return response.json({ error: err.message });
  }
});

userRoutes.put('/profile', isAuth, async (request: any, response) => {
  const user = await User.findById(request.user._id);
  if (user) {
    user.name = request.body.name || user.name;
    user.email = request.body.email || user.email;
    if (request.body.password) {
      user.password = hashSync(request.body.password, 8);
    }
    const updatedUser = await user.save();
    response.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser),
    });
  }
});

userRoutes.get('/:id', async (request, response) => {
  const { id } = request.params;
  const user = await User.findById(id);
  if (user) {
    return response.send(user);
  }
  return response.status(404).json({ message: 'Usuário não encontrado' });
});

export default userRoutes;
