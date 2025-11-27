import { CreateUserDto } from '../dtos/user';
import bcrypt from 'bcrypt';
import User from '../models/users';

const SALT_ROUNDS = 10;

export async function createUser(dto: CreateUserDto) {
  const existingUser = await User.findOne({ where: { email: dto.email } });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

  const user = await User.create({
    ...dto,
    password: hashedPassword,
  });

  const { password, ...userWithoutPassword } = user.get({ plain: true });
  return userWithoutPassword;
}

// export const users=async(req:Request,res:Response)=>{
//   const userlist=User.findAll({where:{UpdatedAt:desc}})
// }