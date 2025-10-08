import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { useToast } from '../ui/use-toast';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Mail, Lock, Shield } from 'lucide-react';
import { useForm, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema, LoginFormValues, RegisterFormValues } from '../../schemas/authSchemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import OAuthButtons from './OAuthButton';

export function AuthForms() {
  const { login, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });
  
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    }
  });
  
  const handleLoginSubmit = async (values: FieldValues) => {
    const loginValues = values as LoginFormValues;
    setIsSubmitting(true);
    setError(null);
    
    try {
      await login(loginValues.email, loginValues.password);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur VigilanceFrance",
      });
      navigate('/map');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue lors de la connexion";
      setError(errorMessage);
      toast({
        title: "Erreur de connexion",
        description: "L'email ou le mot de passe est incorrect",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRegisterSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await registerUser({
        _id: '',
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      });
      navigate('/map');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue lors de l'inscription";
      setError(errorMessage);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de la création de votre compte. Peut-être que l'email est déjà utilisé?",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-md w-full mx-auto">
      {/* Card */}
      <div className="bg-card dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-border dark:border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-center">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-2"
          >
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">VigilanceFrance</h2>
          </motion.div>
          <p className="text-blue-100 mt-2 text-sm">Plateforme de signalement collaboratif</p>
        </div>

        {/* Error */}
        {error && (
          <div className="px-6 pt-4">
            <div className="bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="login" className="w-full p-6">
          <TabsList className="grid grid-cols-2 mb-6 bg-muted dark:bg-gray-800/50 rounded-lg overflow-hidden">
            <TabsTrigger value="login" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">Connexion</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">Inscription</TabsTrigger>
          </TabsList>

          {/* Login Form */}
          <TabsContent value="login" className="min-h-[450px]">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
              {/* Login Form */}
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-6">
                  {/* Email */}
                  <FormField control={loginForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse email</FormLabel>
                      <FormControl>
                        <Input placeholder="votre@email.com" type="email" disabled={isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />

                  {/* Password */}
                  <FormField control={loginForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showPassword ? "text" : "password"} placeholder="••••••••" disabled={isSubmitting} {...field} className="pr-10" />
                          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />

                  {/* Remember & Submit */}
                  <div className="flex items-center justify-between">
                    <FormField control={loginForm.control} name="rememberMe" render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                        </FormControl>
                        <FormLabel className="text-sm !mt-0">Se souvenir de moi</FormLabel>
                      </FormItem>
                    )} />
                    <Button variant="link" className="text-primary text-sm" disabled={isSubmitting}>Mot de passe oublié?</Button>
                  </div>
                  <OAuthButtons />
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white" disabled={isSubmitting}>
                    {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                  </Button>
                </form>
              </Form>
            </motion.div>
          </TabsContent>

          {/* Register Form */}
          <TabsContent value="register" className="min-h-[450px]">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
              {/* Register Form */}
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={registerForm.control} name="firstName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )} />
                    <FormField control={registerForm.control} name="lastName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={registerForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse email</FormLabel>
                      <FormControl><Input type="email" {...field} disabled={isSubmitting} /></FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />

                  <FormField control={registerForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showPassword ? "text" : "password"} {...field} disabled={isSubmitting} className="pr-10" />
                          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />

                  <FormField control={registerForm.control} name="confirmPassword" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmer le mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showConfirmPassword ? "text" : "password"} {...field} disabled={isSubmitting} className="pr-10" />
                          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />

                  <FormField control={registerForm.control} name="acceptTerms" render={({ field }) => (
                    <FormItem className="flex items-start space-x-2">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1" disabled={isSubmitting} />
                      </FormControl>
                      <div>
                        <FormLabel className="text-sm font-normal">
                          J'accepte les <Link to="/legal/terms" className="text-primary hover:underline font-medium">conditions d'utilisation</Link> et la <Link to="/legal/privacy" className="text-primary hover:underline font-medium">politique de confidentialité</Link>
                        </FormLabel>
                        <FormMessage className="text-xs" />
                      </div>
                    </FormItem>
                  )} />
                  <OAuthButtons />

                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white" disabled={isSubmitting}>
                    {isSubmitting ? 'Inscription en cours...' : 'Créer un compte'}
                  </Button>
                </form>
              </Form>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer note */}
      <div className="mt-6 text-center text-muted-foreground text-sm">
        <p className="flex items-center justify-center gap-2">
          <Shield className="h-4 w-4" /> Vos données sont sécurisées et protégées
        </p>
      </div>
    </div>
  );
}