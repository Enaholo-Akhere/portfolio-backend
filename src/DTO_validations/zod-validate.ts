import { Response, Request, NextFunction } from "express";
import { AnyZodObject } from "zod";

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query,
        });
        next();
    }
    catch (error: any) {
        return res.status(400).json({ message: error.errors[0].message, status: 'failed' });
    }
}

export default validate;