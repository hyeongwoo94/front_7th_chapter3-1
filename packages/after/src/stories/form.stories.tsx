import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';

const formSchema = z.object({
  username: z.string().min(2, {
    message: '사용자명은 최소 2자 이상이어야 합니다.',
  }),
  email: z.string().email({
    message: '올바른 이메일 형식이 아닙니다.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

const meta = {
  title: 'UI/Form',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicForm: Story = {
  render: () => {
    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: '',
        email: '',
      },
    });

    function onSubmit(values: FormValues) {
      console.log(values);
      alert(`제출된 값: ${JSON.stringify(values, null, 2)}`);
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[400px]">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>사용자명</FormLabel>
                <FormControl>
                  <Input placeholder="홍길동" {...field} />
                </FormControl>
                <FormDescription>
                  이것은 공개 프로필에 표시될 이름입니다.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  이메일 주소를 입력하세요.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">제출</Button>
        </form>
      </Form>
    );
  },
};

export const WithValidation: Story = {
  render: () => {
    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: '',
        email: '',
      },
    });

    function onSubmit(values: FormValues) {
      console.log(values);
      alert(`제출된 값: ${JSON.stringify(values, null, 2)}`);
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[400px]">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>사용자명 *</FormLabel>
                <FormControl>
                  <Input placeholder="홍길동" {...field} />
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
                <FormLabel>이메일 *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">제출</Button>
        </form>
      </Form>
    );
  },
};

