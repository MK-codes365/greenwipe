
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, signInWithPopup } from 'firebase/auth';
import { Facebook, Twitter } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isRegister, setIsRegister] = useState(true);

  const { toast } = useToast();
  const router = useRouter();
  const auth = getAuth();

  const handleAuthAction = async () => {
    if (isRegister && password !== repeatPassword) {
      toast({
        variant: 'destructive',
        title: 'Passwords do not match',
        description: 'Please ensure your passwords match.',
      });
      return;
    }
    
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: 'Registration Successful',
          description: 'Welcome! You can now log in.',
        });
        setIsRegister(false); // Switch to login view after successful registration
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: 'Login Successful',
          description: 'Welcome back!',
        });
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message,
      });
    }
  };

  const handleSocialSignIn = async (providerName: 'google' | 'facebook' | 'twitter') => {
    let provider;
    switch(providerName) {
        case 'google':
            provider = new GoogleAuthProvider();
            break;
        case 'facebook':
            provider = new FacebookAuthProvider();
            break;
        case 'twitter':
            provider = new TwitterAuthProvider();
            break;
    }

    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Login Successful',
        description: 'Welcome!',
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: `Sign-In Failed`,
        description: error.message,
      });
    }
  };

  const SocialButton = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => (
    <Button variant="outline" size="icon" className="rounded-full bg-transparent border-white/50 text-white hover:bg-white/10 hover:text-white" onClick={onClick}>
      {children}
    </Button>
  );


  return (
    <div className="login-page-bg flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-4xl mx-auto rounded-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
            
            {/* Left Column */}
            <div className="relative text-white p-12 flex flex-col justify-center">
                <h1 className="text-4xl font-bold mb-4">Let's Get Started</h1>
                <p className="text-white/80">
                    Create an account to securely erase your data, generate verifiable wipe certificates, and contribute to a greener planet by reducing e-waste.
                </p>
                <div className="mt-8 flex justify-center">
                    <Logo className="h-16 w-auto logo-float" />
                </div>
            </div>

            {/* Right Column */}
            <div className="relative text-white p-12 flex flex-col">
                <h2 className="text-3xl font-bold mb-8 text-center">{isRegister ? 'Sign up' : 'Sign in'}</h2>
                
                <form onSubmit={(e) => {e.preventDefault(); handleAuthAction(); }} className="flex-grow space-y-6">
                    {isRegister && (
                        <Input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} className="bg-transparent border-0 border-b rounded-none focus:ring-0 focus:border-primary" />
                    )}
                    <Input type="email" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} className="bg-transparent border-0 border-b rounded-none focus:ring-0 focus:border-primary" />
                    <Input type="password" placeholder="Create Password" value={password} onChange={e => setPassword(e.target.value)} className="bg-transparent border-0 border-b rounded-none focus:ring-0 focus:border-primary" />
                    {isRegister && (
                        <Input type="password" placeholder="Repeat password" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} className="bg-transparent border-0 border-b rounded-none focus:ring-0 focus:border-primary" />
                    )}
                    <Button type="submit" className="w-full bg-primary hover:bg-green-700 text-white font-bold py-3 mt-4">
                        {isRegister ? 'Sign up' : 'Sign in'}
                    </Button>
                </form>

                <div className="mt-8">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="h-px bg-white/50 flex-grow"></div>
                        <span className="text-xs text-white/80">OR</span>
                        <div className="h-px bg-white/50 flex-grow"></div>
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        <SocialButton onClick={() => handleSocialSignIn('facebook')}>
                            <Facebook className="h-5 w-5" />
                        </SocialButton>
                         <SocialButton onClick={() => handleSocialSignIn('twitter')}>
                            <Twitter className="h-5 w-5" />
                        </SocialButton>
                        <SocialButton onClick={() => handleSocialSignIn('google')}>
                            <svg className="h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 261.8 0 120.8 109.8 8 244 8c69.1 0 125.3 27.2 170.4 69.1L359.7 127.1c-42.3-40.2-98.4-65.4-150.7-65.4-118.4 0-215.3 96.2-215.3 215.3 0 119.1 96.9 215.3 215.3 215.3 126.4 0 200.7-88.9 200.7-204.3 0-14.3-.4-27.9-1.2-40.9H244V261.8z"></path></svg>
                        </SocialButton>
                    </div>
                </div>

                <div className="mt-auto pt-8 text-center text-sm">
                  <p className="text-white/80">
                      {isRegister ? "Already a Member?" : "Don't have an account?"}{' '}
                      <button onClick={() => setIsRegister(!isRegister)} className="font-semibold text-primary hover:underline">
                          {isRegister ? "Sign in here" : "Sign up here"}
                      </button>
                  </p>
                </div>
            </div>
        </div>
    </div>
  );
}
