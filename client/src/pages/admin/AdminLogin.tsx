import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../components/ui/use-toast';
import { Shield, Lock, AtSign, Loader2 } from 'lucide-react';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Champs obligatoires',
        description: 'Veuillez remplir tous les champs.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/admin/dashboard');
      
      toast({
        title: 'Connexion réussie',
        description: 'Bienvenue dans l\'interface d\'administration.',
      });
    } catch (error) {
      toast({
        title: 'Erreur de connexion',
        description: 'Identifiants incorrects. Veuillez réessayer.',
        variant: 'destructive'
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="container max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Vigilance Admin</h1>
          <p className="text-gray-600 mt-2">Interface d'administration</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Connexion Administrateur</CardTitle>
            <CardDescription>
              Connectez-vous pour accéder au panneau d'administration
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@vigilance.fr"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <a href="/" className="hover:underline">
            Retour au site
          </a>
        </div>
      </div>
    </div>
  );
}
