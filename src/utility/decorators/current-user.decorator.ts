
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { UserEntity } from 'src/users/entities/user.entity'; 

export const CurrentUser = createParamDecorator(
  (_data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log(request.currentUser)
    return request.currentUser;
  },
);

// export const CurrentUser = createParamDecorator((_data, ctx: ExecutionContext): UserEntity => {
//     const req = ctx.switchToHttp().getRequest()
//     return req.currentUser


// }) 