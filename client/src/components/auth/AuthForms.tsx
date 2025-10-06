import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { useToast } from '../ui/use-toast';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Mail, Lock, User as UserIcon, Shield } from 'lucide-react';
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

  const handleFranceConnectLogin = async () => {
    try {
      const franceConnectCode = "mock_fc_code"; 
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
      <div className="bg-card dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-border dark:border-gray-800">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-2"
          >
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              VigilanceFrance
            </h2>
          </motion.div>
          <p className="text-center mt-2 text-blue-100">
            Plateforme de signalement collaboratif
          </p>
        </div>
        
        {error && (
          <div className="px-6 pt-4 -mb-2">
            <div className="bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}
        
        <Tabs defaultValue="login" className="w-full p-6">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted dark:bg-gray-800/50">
            <TabsTrigger value="login" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">Connexion</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="min-h-[450px]">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </Button>
                <FranceConnectButton onClick={handleFranceConnectLogin} disabled={isSubmitting} />
              </div>

              <div className="relative flex items-center justify-center">
                <div className="absolute border-t border-border dark:border-gray-700 w-full"></div>
                <span className="relative px-2 bg-card dark:bg-gray-900/70 text-sm text-muted-foreground">ou avec email</span>
              </div>

              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-6">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input 
                              placeholder="votre@email.com"
                              type="email"
                              className="pl-10"
                              disabled={isSubmitting}
                              {...field} 
                            />
                          </div>
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
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input 
                              placeholder="••••••••"
                              type={showPassword ? "text" : "password"}
                              className="pl-10 pr-10"
                              disabled={isSubmitting}
                              {...field} 
                            />
                            <button 
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <div className="space-x-1 flex justify-between items-center w-full">
                          <FormLabel className="text-sm !mt-0">
                            Se souvenir de moi
                          </FormLabel>
                          <Button variant="link" className="p-0 h-auto text-primary" disabled={isSubmitting}>
                            Mot de passe oublié?
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white" 
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
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </Button>
                <FranceConnectButton onClick={handleFranceConnectLogin} disabled={isSubmitting} />
              </div>

              <div className="relative flex items-center justify-center">
                <div className="absolute border-t border-border dark:border-gray-700 w-full"></div>
                <span className="relative px-2 bg-card dark:bg-gray-900/70 text-sm text-muted-foreground">ou avec email</span>
              </div>
              
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <Input disabled={isSubmitting} {...field} />
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
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input disabled={isSubmitting} {...field} />
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
                        <FormLabel>Adresse email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="votre@email.com"
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
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pr-10"
                              disabled={isSubmitting}
                              {...field} 
                            />
                            <button 
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                        <FormLabel>Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pr-10"
                              disabled={isSubmitting}
                              {...field} 
                            />
                            <button 
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                            className="mt-1"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <div>
                          <FormLabel className="text-sm font-normal">
                            J'accepte les <Link to="/legal/terms" className="text-primary hover:underline font-medium">conditions d'utilisation</Link> et la <Link to="/legal/privacy" className="text-primary hover:underline font-medium">politique de confidentialité</Link>
                          </FormLabel>
                          <FormMessage className="text-xs" />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white" 
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
      
      <div className="mt-6 text-center text-muted-foreground text-sm">
        <p className="flex items-center justify-center gap-2">
          <Shield className="h-4 w-4" />
          Vos données sont sécurisées et protégées
        </p>
      </div>
    </div>
  );
}