import { BaseUser, User } from './user'

export interface BaseTask {
  user: BaseUser,
  description: string,
  image: string,
  dueDate: number,
  isComplete: boolean
}

export interface Task extends BaseTask {
  id: number
}

export interface TaskDetail extends Task {
  user: User
}
