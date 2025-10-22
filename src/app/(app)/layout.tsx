
import { AppLayout } from '@/components/app-layout';
import { UserProfile } from '@/components/user-profile';

export default function AppPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <AppLayout>
        {children}
      </AppLayout>
  );
}
