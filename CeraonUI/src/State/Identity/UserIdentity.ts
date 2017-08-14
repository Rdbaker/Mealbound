interface UserIdentity {
  id: string;
  created_at: string;
  public_name: string;
  first_name: string;
  last_name: string;
  image_url: string;
  email: string;
  address: string;
}

export interface UserIdentityUpdateModel extends UserIdentity {
  password: string;
  confirm_pw: string;
}

export default UserIdentity;
