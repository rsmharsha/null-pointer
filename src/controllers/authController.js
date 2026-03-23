import User from "../models/User.js"
import { registerSchema } from "../validators/authValidator.js"

export const register = async (req, res, next) => {
    try {
        // Step 1: Validating req body
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message })
        }

        // Step 2: Check if email already exists
        const existing = await User.findOne({ email: value.email })
        if (existing) {
            return res.status(409).json({ success: false, message: 'Email already registered' })
        }

        // Step 3: Create the user
        
        const user = await User.create(value);

        // Step 4: Return response without password
        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });

    } catch (err) {
        next(err);
    }
}