import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { useToast } from '../ui/use-toast';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useForm, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema, LoginFormValues, RegisterFormValues } from '../../schemas/authSchemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

import { FranceConnectButton } from '../ui/franceConnectButton';

export function AuthForms() {
  const { login, register: registerUser, googleAuth, franceConnectAuth } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Login form with react-hook-form and zod
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });
  
  // Register form with react-hook-form and zod
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
        description: errorMessage,
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
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      const googleToken = "mock_google_token";
      
      await googleAuth(googleToken);
      toast({
        title: "Connexion Google réussie",
        description: "Bienvenue sur VigilanceFrance",
      });
      navigate('/map');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue avec l'authentification Google";
      setError(errorMessage);
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Fonction pour gérer la connexion avec FranceConnect
  const handleFranceConnectLogin = async () => {
    try {
      // This would be replaced with actual FranceConnect OAuth flow
      const franceConnectCode = "mock_fc_code"; // would come from FranceConnect redirect
      
      await franceConnectAuth(franceConnectCode);
      toast({
        title: "Connexion FranceConnect réussie",
        description: "Bienvenue sur VigilanceFrance",
      });
      navigate('/map');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue avec FranceConnect";
      setError(errorMessage);
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-md w-full">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-center">
              VigilanceFrance
            </h2>
            <p className="text-center mt-2 text-blue-100">
              Plateforme de signalement collaboratif
            </p>
          </motion.div>
        </div>
        
        {/* Display global error if exists */}
        {error && (
          <div className="px-6 pt-4 -mb-2">
            <div className="bg-red-50 text-red-800 px-4 py-2 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}
        
        <Tabs defaultValue="login" className="w-full p-6">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Connexion</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="min-h-[450px]">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Boutons de connexion tiers */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full border-gray-300 hover:bg-gray-50 flex items-center justify-center"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path 
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
                      fill="#4285F4"
                    />
                    <path 
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
                      fill="#34A853"
                    />
                    <path 
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
                      fill="#FBBC05"
                    />
                    <path 
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
                <FranceConnectButton onClick={handleFranceConnectLogin} disabled={isSubmitting} />
              </div>

              <div className="relative flex items-center justify-center">
                <div className="absolute border-t border-gray-300 w-full"></div>
                <span className="relative px-2 bg-white text-sm text-gray-500">ou avec email</span>
              </div>

              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-6">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Adresse email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="votre@email.com"
                            type="email"
                            className="border-blue-100 focus:border-blue-300"
                            disabled={isSubmitting}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="••••••••"
                              type={showPassword ? "text" : "password"}
                              className="border-blue-100 focus:border-blue-300 pr-10"
                              disabled={isSubmitting}
                              {...field} 
                            />
                            <button 
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isSubmitting}
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-600"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <div className="space-x-1 flex justify-between items-center w-full">
                          <FormLabel className="text-sm text-gray-600">
                            Se souvenir de moi
                          </FormLabel>
                          <Button variant="link" className="p-0 h-auto text-blue-600" disabled={isSubmitting}>
                            Mot de passe oublié?
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                  </Button>
                </form>
              </Form>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="register" className="min-h-[450px]">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Boutons d'inscription tiers */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full border-gray-300 hover:bg-gray-50 flex items-center justify-center"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path 
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
                      fill="#4285F4"
                    />
                    <path 
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
                      fill="#34A853"
                    />
                    <path 
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
                      fill="#FBBC05"
                    />
                    <path 
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
                <FranceConnectButton onClick={handleFranceConnectLogin} disabled={isSubmitting} />
              </div>

              <div className="relative flex items-center justify-center">
                <div className="absolute border-t border-gray-300 w-full"></div>
                <span className="relative px-2 bg-white text-sm text-gray-500">ou avec email</span>
              </div>
              
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Prénom</FormLabel>
                          <FormControl>
                            <Input 
                              className="border-blue-100 focus:border-blue-300"
                              disabled={isSubmitting}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Nom</FormLabel>
                          <FormControl>
                            <Input 
                              className="border-blue-100 focus:border-blue-300"
                              disabled={isSubmitting}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Adresse email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="votre@email.com"
                            className="border-blue-100 focus:border-blue-300"
                            disabled={isSubmitting}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="border-blue-100 focus:border-blue-300 pr-10"
                              disabled={isSubmitting}
                              {...field} 
                            />
                            <button 
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isSubmitting}
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="border-blue-100 focus:border-blue-300 pr-10"
                              disabled={isSubmitting}
                              {...field} 
                            />
                            <button 
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              disabled={isSubmitting}
                            >
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-2">
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-600 mt-1"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <div>
                          <FormLabel className="text-sm text-gray-600">
                            J'accepte les <Link to={"/legal/terms"}  className="text-blue-600 hover:text-blue-800 font-medium">conditions d'utilisation</Link> et la <Link to={"/legal/privacy"} className="text-blue-600 hover:text-blue-800 font-medium">politique de confidentialité</Link>
                          </FormLabel>
                          <FormMessage className="text-xs" />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Inscription en cours...' : 'Créer un compte'}
                  </Button>
                </form>
              </Form>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Message de sécurité en dessous du formulaire */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        <p className="flex items-center justify-center">
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Vos données sont sécurisées et protégées
        </p>
      </div>
    </div>
  );
}