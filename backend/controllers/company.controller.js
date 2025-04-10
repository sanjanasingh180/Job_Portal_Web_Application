import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Register a new company
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;

        // Validate input
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false,
            });
        }

        // Check for existing company
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "A company with the same name already exists.",
                success: false,
            });
        }

        // Create new company
        company = await Company.create({
            name: companyName,
            userId: req.id, // User ID from middleware
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true,
        });
    } catch (error) {
        console.error("Error registering company:", error);
        res.status(500).json({
            message: "Internal server error while registering company.",
            success: false,
        });
    }
};

// Get all companies for a logged-in user
export const getCompany = async (req, res) => {
    try {
        const userId = req.id;

        // Find companies by user ID
        const companies = await Company.find({ userId });
        if (!companies || companies.length === 0) {
            return res.status(404).json({
                message: "No companies found for the user.",
                success: false,
            });
        }

        return res.status(200).json({
            companies,
            success: true,
        });
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json({
            message: "Internal server error while fetching companies.",
            success: false,
        });
    }
};

// Get a company by ID
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;

        // Find company by ID
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false,
            });
        }

        return res.status(200).json({
            company,
            success: true,
        });
    } catch (error) {
        console.error("Error fetching company by ID:", error);
        res.status(500).json({
            message: "Internal server error while fetching the company.",
            success: false,
        });
    }
};

// Update company details
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;

        // Handle file upload and upload to Cloudinary
        let logo;
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logo = cloudResponse.secure_url;
        }

        // Prepare update data
        const updateData = { name, description, website, location };
        if (logo) updateData.logo = logo;

        // Update company details
        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Company information updated successfully.",
            company,
            success: true,
        });
    } catch (error) {
        console.error("Error updating company:", error);
        res.status(500).json({
            message: "Internal server error while updating company.",
            success: false,
        });
    }
};
