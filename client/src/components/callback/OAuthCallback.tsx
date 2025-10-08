import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { googleAuth, githubAuth } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Get parameters from URL
      const code = searchParams.get('code');
      const state = searchParams.get('state'); // 'google' or 'github'
      const errorParam = searchParams.get('error');

      // Handle errors from OAuth provider
      if (errorParam) {
        const errorMessage = searchParams.get('error_description') || 'Authentication cancelled';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Authentication Failed',
          description: errorMessage,
        });
        setTimeout(() => navigate('/auth'), 3000);
        return;
      }

      // Validate we have required parameters
      if (!code || !state) {
        setError('Invalid callback parameters');
        toast({
          variant: 'destructive',
          title: 'Authentication Failed',
          description: 'Missing required parameters',
        });
        setTimeout(() => navigate('/auth'), 3000);
        return;
      }

      try {
        // Call appropriate auth method based on provider
        if (state === 'google') {
          await googleAuth(code);
          toast({
            title: 'Success!',
            description: 'Successfully logged in with Google',
          });
        } else if (state === 'github') {
          await githubAuth(code);
          toast({
            title: 'Success!',
            description: 'Successfully logged in with GitHub',
          });
        } else {
          throw new Error('Unknown OAuth provider');
        }

        // Redirect to map page after successful login
        navigate('/map', { replace: true });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Authentication Failed',
          description: errorMessage,
        });
        setTimeout(() => navigate('/auth'), 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, googleAuth, githubAuth, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        {error ? (
          <>
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Authentication Failed</h2>
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm text-muted-foreground">Redirecting back to login...</p>
          </>
        ) : (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <h2 className="text-xl font-semibold">Completing Authentication</h2>
            <p className="text-muted-foreground">Please wait while we log you in...</p>
          </>
        )}
      </div>
    </div>
  );
}