import { object, string } from 'yup';

export const registerSchema = object({
    name: string().required("Name is required for a successful registration."),
    phone: string().matches(/^\d{10}$/, "Phone number must be 10 digits long.")
                   .required("Phone number is required for a successful registration."),
    email: string().email("Please enter a valid email address.").required("Email is required for a successful registration."),
    address: string().required("Address is required for a successful registration."),
    password: string().required("Password is required for a successful registration.")
                      .min(6, "Password must be atleast 6 characters long.")
                      .matches(/[A-Z]/, "Password must contain at least one upper case letter")
                      .matches(/[0-9]/, "Password must contain at least one number")
                      .matches(/[@$!%*?&]/, "Password must contain at least one special character (@, $, !, %, *, ?, &)")
})