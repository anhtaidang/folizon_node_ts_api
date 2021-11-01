import moment from 'moment';
import { EnumDateTimeFormat_Sperator_Full, EnumFolderType } from '@/constants/enum';
import { genS3MediaUrlByFolderType, isEmpty, validateUrl } from '@utils/util';
import { USER_AVATAR_DEFAULT } from '@constants/constants';
import { UserDTO } from '@/interfaces/users.interface';

class UserHelper {
  public bindDataUserInfos = (dict: UserDTO) => {
    const avatar = isEmpty(dict.avatar) ? USER_AVATAR_DEFAULT : dict.avatar;
    return {
      uid: dict.uid,
      fullname: dict.fullname,
      firstName: dict.firstName,
      lastName: dict.lastName,
      username: dict.username,
      phone: dict.phone,
      email: dict.email,
      address: dict.address,
      salt: dict.salt,
      avatar: validateUrl(avatar) ? avatar : genS3MediaUrlByFolderType(EnumFolderType.USER.id, dict.avatar),
      isActive: dict.isActive,
      createdBy: dict.userCreated?.fullname || null,
      createdTime: moment.unix(dict.createdTime).format(EnumDateTimeFormat_Sperator_Full),
      updatedBy: dict.userUpdated?.fullname || null,
      updatedTime: dict.updatedTime ? moment.unix(dict.updatedTime).format(EnumDateTimeFormat_Sperator_Full) : null,
    };
  };
}

export default UserHelper;
