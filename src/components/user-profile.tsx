// src/components/user-profile.tsx
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { useUser } from '@/firebase';
import { getAuth, signOut, signInAnonymously } from 'firebase/auth';
import { useEffect } from 'react';

export function UserProfile() {
  const { user, loading } = useUser();
  const auth = getAuth();

  const handleSignIn = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error('Anonymous sign-in failed', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign-out failed', error);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      handleSignIn();
    }
  }, [loading, user]);

  if (loading || !user) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }
  
  const getInitials = (name?: string | null) => {
    if (!name) return "AN";
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
          <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="font-normal text-sm text-muted-foreground">
            {user.isAnonymous ? "Anonymous User" : (user.email || "No email")}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
