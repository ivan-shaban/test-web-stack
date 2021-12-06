import {User} from '@prisma/client'

export type ClientUser = Omit<User, 'dob'|'createdAt'|'updatedAt'> & {
    readonly dob: string
}
