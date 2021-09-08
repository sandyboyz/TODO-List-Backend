import { BaseUser, User } from './user'

export interface BaseTask {
  user: BaseUser,
  description: string,
  image: string,
  dueDate: string,
  isComplete: boolean
}

export interface Task extends BaseTask {
  id: number
}

export interface TaskDetail extends Task {
  user: User
}
