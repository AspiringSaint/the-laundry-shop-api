const mongoose = require('mongoose');

/**
 * User Schema
 * ------------------------
 * Represents all types of users in the system: admin, owner, manager, staff, rider, customer.
 * Each user has basic personal details, contact information, authentication credentials,
 * and optionally belongs to a branch.
 */
const userSchema = new mongoose.Schema(
    {
        // Basic personal details
        firstname: { type: String, required: true },  // First name is required (e.g., "John")
        middlename: { type: String },                 // Middle name is optional (e.g., "Paul")
        lastname: { type: String, required: true },   // Last name is required (e.g., "Doe")

        // Optional personal info
        age: { type: Number },                        // Age is optional, stored as a number
        phone: { type: String },                      // Phone number, useful for contact/notifications

        // Locations history or saved addresses
        locations: {
            type: [
                {
                    name: { type: String },           // Name for the location (e.g., "Home", "Office")
                    address: { type: String }         // Full address string
                }
            ],
            default: []                               // Defaults to an empty array if no locations saved
        },

        // Role determines the type of user and their access rights
        role: {
            type: String,
            enum: ['admin', 'owner', 'manager', 'staff', 'rider', 'customer'], // Only allowed roles
            default: 'customer', // Default role is customer (if not specified during registration)
            required: true       // Role must always be provided
        },

        // Branch assignment (only for staff, managers, riders, etc.)
        branchId: {
            type: mongoose.Schema.Types.ObjectId, // Stores reference to the Branch collection
            ref: 'Branch'                         // Mongoose population target
        },

        // Authentication credentials
        email: {
            type: String,
            required: true,   // Every user must have an email (used as login identifier)
            unique: true,     // Prevent duplicate accounts with same email
            trim: true        // Automatically trims whitespace from email
        },
        password: { type: String },                 // Hashed permanent password
        temporaryPassword: { type: String },        // Optional hashed temp password (e.g., for first login)

        // Account status (instead of deleting, we deactivate accounts)
        status: { 
            type: String, 
            enum: ['active', 'inactive'],          // Only "active" or "inactive" allowed
            default: 'active'                      // New accounts are active by default
        }
    },
    {
        // Automatically adds `createdAt` and `updatedAt` timestamps for auditing
        timestamps: true
    }
);

// Exporting User model so it can be used in controllers and services
module.exports = mongoose.model('User', userSchema);
