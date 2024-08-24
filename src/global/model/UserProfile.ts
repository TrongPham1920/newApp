enum UserRole {
  SuperAdmin = 0,
  Agent = 1,
}

export interface Data {
  user: UserProfile;
  token: string;
}

export class UserProfile {
  code: number;
  mess: string;
  _id: string;
  email: string;
  phone: string;
  avatar: string;
  status: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  token: string;

  update(props: any) {
    // Cập nhật thuộc tính của đối tượng với các thuộc tính từ props
    Object.assign(this, props);
  }

  isInternalUser(): boolean {
    return (
      this.role === UserRole.SuperAdmin // Chỉ có SuperAdmin trong enum
    );
  }

  canManagedRooms(): boolean {
    return this.role === UserRole.SuperAdmin;
  }

  canChangeRoomStatus(): boolean {
    return this.role === UserRole.SuperAdmin;
  }

  canViewBookableRoom(): boolean {
    return this.role === UserRole.Agent;
  }

  canViewPaymentInfo(): boolean {
    return this.role === UserRole.Agent;
  }

  canViewBookedRooms(): boolean {
    return false;
  }

  isAdmin(): boolean {
    return this.role === UserRole.SuperAdmin;
  }

  isReceptionist(): boolean {
    return false; // Không có vai trò Receptionist trong enum
  }

  isAgent(): boolean {
    return this.role === UserRole.Agent;
  }

  static jsonToModel(json: any): UserProfile {
    let model = new UserProfile();
    model.code = json.code !== undefined ? json.code : 0;
    model.mess = json.mess !== undefined ? json.mess : "";
    model._id = json._id !== undefined ? json._id : "";
    model.email = json.email !== undefined ? json.email : "";
    model.phone = json.phone !== undefined ? json.phone : "";
    model.avatar = json.avatar !== undefined ? json.avatar : "";
    model.status = json.status !== undefined ? Boolean(json.status) : false;

    // Kiểm tra và gán giá trị của role
    model.role =
      json.role !== undefined &&
      UserRole[json.role as keyof typeof UserRole] !== undefined
        ? UserRole[json.role as keyof typeof UserRole]
        : UserRole.SuperAdmin; // Cung cấp giá trị mặc định hợp lý

    model.createdAt = json.createdAt ? new Date(json.createdAt) : new Date();
    model.updatedAt = json.updatedAt ? new Date(json.updatedAt) : new Date();
    model.__v = json.__v !== undefined ? json.__v : 0;
    model.token = json.token !== undefined ? json.token : "";

    return model;
  }
}
