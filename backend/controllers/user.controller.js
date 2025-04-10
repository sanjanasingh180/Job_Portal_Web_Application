import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";



export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email",
                success: false,
            });
        }

        let profilePhoto = "https://default-profile-photo-url.com"; // Default photo URL
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePhoto = cloudResponse.secure_url;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto,
            },
        });

        return res.status(201).json({
            message: "Account created successfully",
            success: true,
        });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({
            message: "An error occurred during registration",
            success: false,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        if (role !== user.role) {
            return res.status(400).json({
                message: "Role mismatch",
                success: false,
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });

        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 24 * 60 * 60 * 1000, // 1 day
                httpOnly: true,
                sameSite: "strict",
            })
            .json({
                message: `Welcome back, ${user.fullname}`,
                user,
                success: true,
            });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            message: "An error occurred during login",
            success: false,
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true,
        });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({
            message: "An error occurred during logout",
            success: false,
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const userId = req.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        let skillsArray = skills ? skills.split(",") : user.profile.skills;
        let resumeUrl = user.profile.resume;

        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            resumeUrl = cloudResponse.secure_url;
        }

        // Update user details
        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.profile.bio = bio || user.profile.bio;
        user.profile.skills = skillsArray;
        user.profile.resume = resumeUrl;

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            user,
            success: true,
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({
            message: "An error occurred while updating the profile",
            success: false,
        });
    }
};
