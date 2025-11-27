import { expect } from 'chai';
import sequelize from '../database/connection';
import User from '../models/users';
import { createUser } from '../services/user';
import { CreateUserDto } from '../dtos/user';

describe('User Service - Create User', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it('1. should create a new user successfully', async () => {
    const userData: CreateUserDto = {
      email: 'test@example.com',
      password: 'TestPass123!',
      first_name: 'John',
      last_name: 'Doe',
    };

    const user = await createUser(userData);

    expect(user).to.exist;
    expect(user.email).to.equal('test@example.com');
    expect(user.first_name).to.equal('John');
    expect(user.last_name).to.equal('Doe');
    expect(user.password).to.be.undefined; // Password should be excluded
  });

  it('2. should NOT allow duplicate email', async () => {
    const userData: CreateUserDto = {
      email: 'duplicate@example.com',
      password: 'TestPass123!',
      first_name: 'John',
      last_name: 'Doe',
    };

    await createUser(userData);

    try {
      await createUser(userData);
      throw new Error('Expected error not thrown');
    } catch (err: any) {
      expect(err.message).to.include('User with this email already exists');
    }
  });

  it('3. should hash the password', async () => {
    const userData: CreateUserDto = {
      email: 'hash@example.com',
      password: 'TestPass123!',
      first_name: 'Jane',
      last_name: 'Smith',
    };

    await createUser(userData);

    const dbUser = await User.findOne({ where: { email: 'hash@example.com' } });
    expect(dbUser?.password).to.not.equal('TestPass123!');
    expect(dbUser?.password).to.exist;
  });

  it('4. should set default role to user', async () => {
    const userData: CreateUserDto = {
      email: 'role@example.com',
      password: 'TestPass123!',
      first_name: 'Role',
      last_name: 'Test',
    };

    const user = await createUser(userData);

    const dbUser = await User.findOne({ where: { email: 'role@example.com' } });
    expect(dbUser?.role).to.equal('user');
  });
});
