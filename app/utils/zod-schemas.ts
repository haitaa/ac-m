import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters."),
  location: z.string().min(1, "Location must be defined"),
  about: z
    .string()
    .min(10, "Please provide some information about your company"),
  logo: z.string().min(1, "Please upload a logo"),
  website: z.string().url("Please enter a valid URL"),
  xAccount: z.string().optional(),
});

export const jobSeekerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  about: z.string().min(10, "Please provide more information about yourself"),
  resume: z.string().min(1, "Please upload your resume."),
});

export const jobSchema = z.object({
  jobTitle: z.string().min(2, "Job title must be at least 2 characters long."),
  employmentType: z.string().min(1, "Please select an employment type."),
  location: z.string().min(1, "Location must be defined"),
  salaryFrom: z.number().min(1, "Salary from is required"),
  salaryTo: z.number().min(1, "Salary to is required"),
  jobDescription: z.string().min(10, "Please provide a job description"),
  listingDuration: z.number().min(1, "Please select a duration"),

  benefits: z.array(z.string()).min(1, "Please select at least one benefit"),
  companyName: z.string().min(1, "Please select a company"),
  companyLocation: z.string().min(1, "Please select a location"),
  companyLogo: z.string().min(1, "Please upload a logo"),
  companyAbout: z
    .string()
    .min(1, "Please provide some information about your company"),

  companyWebsite: z.string().url("Please enter a valid URL"),
  companyXAccount: z.string().optional(),
});
