import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/user-signup.dto';
import { compare, hash } from 'bcrypt'
import { UserSignInDto } from './dto/user-singin.dto';
import { sign } from 'jsonwebtoken';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async signup(userSignUpDto:UserSignUpDto):Promise<UserEntity>{
    const userExists = await this.findUserByEmail(userSignUpDto.email)
    if(userExists) throw new BadRequestException('Email already exists')

    userSignUpDto.password = await hash(userSignUpDto.password, 10)
    let user = this.userRepository.create(userSignUpDto)
    user = await this.userRepository.save(user)
    delete user.password
    return user
  }

  async signin(userSignInDto:UserSignInDto):Promise<UserEntity>{
    const userExists = await this.userRepository.createQueryBuilder('users').addSelect('users.password')
    .where('users.email=:email',{email:userSignInDto.email}).getOne()
    if(!userExists) throw new BadRequestException('Bad credentials')
    const matchPassword = await compare(userSignInDto.password, userExists.password)
    if(!matchPassword) throw new BadRequestException('Bad credentials')
    delete userExists.password
    return userExists
     
  }
  create(createUserDto: CreateUserDto) {
    
    return 'This action adds a new user';
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find()
  }

  async findOne(id: number): Promise<UserEntity>  {
    try {
      const user = await this.userRepository.findOne({ where: { id }});
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      console.log('>>>', error);
      throw error;
    }
  }
  
  // async getProfile(@CurrentUser() currentUser:UserEntity){
  //   console.log(currentUser)
  //   return currentUser
  // }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email:string){
    return await this.userRepository.findOneBy({email})
  }
  async accessToken(user:UserEntity): Promise<string>{
    return sign({id:user.id, email: user.email},process.env.ACCESS_TOKEN_SECRET_KEY,{expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME})
  }
}
