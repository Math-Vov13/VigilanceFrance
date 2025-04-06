import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { useToast } from '../ui/use-toast';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

import { FranceConnectButton} from '../ui/franceConnectButton';

export function AuthForms() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(loginData.email, loginData.password);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur VigilanceFrance",
      });
      navigate('/map');
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Erreur d'inscription",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }
    
    if (!registerData.acceptTerms) {
      toast({
        title: "Erreur d'inscription",
        description: "Vous devez accepter les conditions d'utilisation",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await register({
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        password: registerData.password,
      });
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      });
      navigate('/map');
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur s'est produite lors de l'inscription",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fonction pour gérer la connexion avec Google
  const handleGoogleLogin = () => {
    toast({
      title: "Connexion Google",
      description: "Redirection vers l'authentification Google...",
    });
    // Implémentation réelle à ajouter
  };

  // Fonction pour gérer la connexion avec FranceConnect
  const handleFranceConnectLogin = () => {
    toast({
      title: "Connexion FranceConnect",
      description: "Redirection vers FranceConnect...",
    });
    // Implémentation réelle à ajouter
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
                <FranceConnectButton onClick={handleFranceConnectLogin} />
              </div>

              <div className="relative flex items-center justify-center">
                <div className="absolute border-t border-gray-300 w-full"></div>
                <span className="relative px-2 bg-white text-sm text-gray-500">ou avec email</span>
              </div>

              <motion.form 
                onSubmit={handleLoginSubmit} 
                className="space-y-6"
              >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Adresse email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="votre@email.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  className="border-blue-100 focus:border-blue-300"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Mot de passe</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="border-blue-100 focus:border-blue-300 pr-10"
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember-me" 
                    checked={loginData.rememberMe}
                    onCheckedChange={(checked) => 
                      setLoginData({...loginData, rememberMe: checked as boolean})
                    }
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <Label htmlFor="remember-me" className="text-sm text-gray-600">
                    Se souvenir de moi
                  </Label>
                </div>
                
                <Button variant="link" className="p-0 h-auto text-blue-600">
                  Mot de passe oublié?
                </Button>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
            </motion.form>
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
                <FranceConnectButton onClick={handleFranceConnectLogin} />
              </div>

              <div className="relative flex items-center justify-center">
                <div className="absolute border-t border-gray-300 w-full"></div>
                <span className="relative px-2 bg-white text-sm text-gray-500">ou avec email</span>
              </div>
              
              <motion.form 
                onSubmit={handleRegisterSubmit} 
                className="space-y-6"
              >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name" className="text-gray-700">Prénom</Label>
                  <Input 
                    id="first-name" 
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                    className="border-blue-100 focus:border-blue-300"
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="last-name" className="text-gray-700">Nom</Label>
                  <Input 
                    id="last-name" 
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                    className="border-blue-100 focus:border-blue-300"
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-gray-700">Adresse email</Label>
                <Input 
                  id="register-email" 
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  className="border-blue-100 focus:border-blue-300"
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-gray-700">Mot de passe</Label>
                <div className="relative">
                  <Input 
                    id="register-password" 
                    type={showPassword ? "text" : "password"}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    className="border-blue-100 focus:border-blue-300 pr-10"
                    required 
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-gray-700">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Input 
                    id="confirm-password" 
                    type={showConfirmPassword ? "text" : "password"}
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                    className="border-blue-100 focus:border-blue-300 pr-10"
                    required 
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={registerData.acceptTerms}
                  onCheckedChange={(checked) => 
                    setRegisterData({...registerData, acceptTerms: checked as boolean})
                  }
                  className="data-[state=checked]:bg-blue-600"
                  required
                />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  J'accepte les <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">conditions d'utilisation</a> et la <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">politique de confidentialité</a>
                </Label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Inscription en cours...' : 'Créer un compte'}
              </Button>
            </motion.form>
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