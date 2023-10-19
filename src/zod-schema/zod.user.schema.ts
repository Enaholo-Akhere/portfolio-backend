import { string, object, TypeOf } from 'zod';

export const createUserSchema = object({
    body: object({
        name: string({ required_error: "Name is required" }).max(20, "must be less than 30 characters"),
        password: string({ required_error: "Password is required" }).min(6, 'Password too short'),
        email: string({ required_error: 'Email is required' }).email()
    })
});

export const loginUserSchema = object({
    body: object({
        password: string({ required_error: "Password is required" }).min(6, 'Password too short'),
        email: string({ required_error: 'Email is required' }).email()
    })
})

export type createUserInputType = TypeOf<typeof createUserSchema>
export type loginUserInputType = TypeOf<typeof loginUserSchema>