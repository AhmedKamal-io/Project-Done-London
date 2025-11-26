import { z } from "zod";

// Allowed Email Domains List
const ALLOWED_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
  "icloud.com",
  "live.com",
  // Add any other allowed domains here
];

// Regex to check if the email ends with an allowed domain
const allowedDomainsRegex = new RegExp(`@(${ALLOWED_DOMAINS.join("|")})$`, "i");

export const bookingSchema = z.object({
  // 1. Date (Required)
  date: z
    .string({
      required_error: "Please select a booking date.",
    })
    .min(1, "Please select a booking date."),

  // 2. City (Required)
  city: z
    .string({
      required_error: "Please select a city.",
    })
    .min(1, "Please select a city."),

  // 3. Name (Max 50 characters)
  name: z
    .string({
      required_error: "Name is required.",
    })
    .min(2, "Name must be at least 2 characters long.")
    .max(50, "Name cannot exceed 50 characters.") // Max 50 set here
    .trim(),

  // 4. Email (Domain Check and Local Part Max 40)
  email: z
    .string({
      required_error: "Email is required.",
    })
    .email("Invalid email format.")
    .max(255, "Email is too long (max 255 characters).")
    .toLowerCase()
    .trim()

    // First Refinement: Check max length of Local Part (before @)
    .refine((val) => val.split("@")[0].length <= 40, {
      message: "The email username (local part) cannot exceed 40 characters.", // Max 40 set here
    })

    // Second Refinement: Check if the domain is on the allowed list
    .refine((val) => allowedDomainsRegex.test(val), {
      message:
        "Please use a common email provider (e.g., Gmail, Yahoo, Outlook).",
    }),

  // 5. Phone (Required)
  phone: z
    .string({
      required_error: "Phone number is required.",
    })
    .min(8, "Phone number is too short.")
    .max(20, "Phone number is too long.")
    .trim(),
});

// TypeScript type inference
export type BookingFormData = z.infer<typeof bookingSchema>;
