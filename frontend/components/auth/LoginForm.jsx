import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid credentials');
      } else {
        toast.success('Login successful!');
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <Card.Header>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900">
            Welcome Back
          </h2>
          <p className="text-secondary-600 mt-2">
            Sign in to your SmartStudy account
          </p>
        </div>
      </Card.Header>

      <Card.Content>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Username or Email"
            type="text"
            required
            error={errors.username?.message}
            {...register('username', {
              required: 'Username or email is required',
            })}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              required
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-secondary-400 hover:text-secondary-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-secondary-600">
            Don't have an account?{' '}
            <a
              href="/auth/register"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign up
            </a>
          </p>
        </div>
      </Card.Content>
    </Card>
  );
};

export default LoginForm;