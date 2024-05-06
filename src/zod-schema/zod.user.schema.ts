import { string, object, TypeOf } from 'zod';

export const createUserSchema = object({
    body: object({
        name: string({ required_error: "Name is required" }).max(20, "Name must be less than 30 characters"),
        password: string({ required_error: "Password is required" }).min(6, 'Password too short'),
        email: string({ required_error: 'Email is required' }).max(80, 'email is too lengthy').email()
    })
});

export const googleSignupUserSchema = object({
    body: object({
        name: string({ required_error: "Name is required" }).max(20, "Name must be less than 30 characters"),
        email: string({ required_error: 'Email is required' }).email()
    })
});


export const loginUserSchema = object({
    body: object({
        password: string({ required_error: "Password is required" }).min(6, 'Password too short'),
        email: string({ required_error: 'Email is required' }).email()
    })
});

export const emailUserSchema = object({
    body: object({
        email: string({ required_error: 'Email is required' }).max(80, 'email is too lengthy').email()
    })
});

export const editUserSchema = object({
    body: object({
        name: string({ required_error: "Name is required" }).max(30, "Name must be less than 30 characters"),
    })
});

export const editPasswordSchema = object({
    body: object({
        password: string({ required_error: "Password is required" }).min(6, 'Password too short'),
    })
});

export const messageSchema = object({
    body: object({
        email: string({ required_error: "Password is required" }).min(6, 'Password too short'),
    })
});

export const userIDSchema = object({
    params: object({
        user_id: string({ required_error: 'user ID is required' }).max(1000, "must be less than 30 characters"),
    })
});



export type createUserInputType = TypeOf<typeof createUserSchema>
export type loginUserInputType = TypeOf<typeof loginUserSchema>
export type editUserInputType = TypeOf<typeof editUserSchema>