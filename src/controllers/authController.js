import User from "../models/User.js"
import { registerSchema } from "../validators/authValidator.js"
import generateToken from "../utils/generateToken.js";
import { loginSchema } from "../validators/authValidator.js";

export const register = async (req, res, next) => {
    try {
        // Step 1: Validating req body
        const { value, error } = registerSchema.validate(req.body);
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

export const login = async (req, res, next) => {
    try {
        const { error, value } = loginSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const user = await User.findOne({ email: value.email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" })
        }

        const isMatch = await user.comparePassword(value.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' })
        }

        const token = generateToken({ userId: user._id, role: user.role });

        res.json({
            success: true,
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        })
    } catch (err) {
        next(err)
    }
}