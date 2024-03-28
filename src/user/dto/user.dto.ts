import { User } from '@/user/entities/user.entity';
import { Location } from '@/location/entities/location.entity';

export class UserDto {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  location?: Location;

  static fromEntity(user: User) {
    const dto = new UserDto();
    dto.id = user.id;
    dto.firstname = user.firstname;
    dto.lastname = user.lastname;
    dto.username = user.username;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    dto.location = user.location;
    return dto;
  }
}
