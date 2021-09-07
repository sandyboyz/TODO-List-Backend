interface BaseUser {
  email: string
}

interface LoginUser extends BaseUser {
  password: string,
}

interface RegisterUser extends LoginUser {
  name: string,
  role: number
}

interface User extends RegisterUser {
  id: number
}

interface ResponseUser extends BaseUser {
  name: string,
  role: number,
  id: number
}

export {
  BaseUser, LoginUser, RegisterUser, User, ResponseUser
}
