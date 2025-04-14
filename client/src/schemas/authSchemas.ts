import * as z from 'zod';

// Login form schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "L'email est requis" })
    .email({ message: "Format d'email invalide" }),
  password: z
    .string()
    .min(1, { message: "Le mot de passe est requis" }),
  rememberMe: z
    .boolean()
});

// Register form schema
export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "Le prénom est requis" }),
  lastName: z
    .string()
    .min(1, { message: "Le nom est requis" }),
  email: z
    .string()
    .min(1, { message: "L'email est requis" })
    .email({ message: "Format d'email invalide" }),
  password: z
    .string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Veuillez confirmer votre mot de passe" }),
  acceptTerms: z
    .boolean()
    .refine(val => val === true, { 
      message: "Vous devez accepter les conditions d'utilisation",
      path: ["acceptTerms"]
    })
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

// Types inferred from schemas
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;