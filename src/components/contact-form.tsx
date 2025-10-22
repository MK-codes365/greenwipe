'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(500, { message: "Message must not exceed 500 characters." }),
});

type FormData = z.infer<typeof formSchema>;

export function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log(data);
    
    toast({
      title: 'Message Sent!',
      description: 'Thanks for reaching out. We will get back to you shortly.',
    });
    
    form.reset();
    setIsSubmitting(false);
  };

  return (
    <Card className="bg-card/70 backdrop-blur-sm border-border/30 p-2 md:-mt-8">
        <CardContent className="p-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} className="bg-input/50" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input placeholder="you@example.com" {...field} className="bg-input/50" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="How can we help you?"
                                    className="resize-none bg-input/50"
                                    rows={4}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting} style={{ backgroundColor: '#00BFFF' }}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : 'Send Message'}
                    </Button>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}
