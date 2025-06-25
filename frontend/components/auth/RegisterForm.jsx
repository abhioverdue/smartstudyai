import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { authAPI } from '@/lib/api';

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authAPI.register({
        email: data.email,
        username: data.username,
        first_name: data.firstName,
        last_name: data.lastName,
        password: data.password,
      });

      toast.success('Account created successfully!');
      router.push('/auth/login');
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <Card.Header>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900">
            Create Account
          </h2>
          <p className="text-secondary-600 mt-2">
            Join SmartStudy and start learning
          </p>
        </div>
      </Card.Header>

      <Card.Content>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              required
              error={errors.firstName?.message}
              {...register('firstName', {
                required: 'First name is required',
              })}
            />
            <Input
              label="Last Name"
              required
              error={errors.lastName?.message}
              {...register('lastName', {
                required: 'Last name is required',
              })}
            />
          </div>

          <Input
            label="Email"
            type="email"
            required
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />

          <Input
            label="Username"
            required
            error={errors.username?.message}
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters',
              },
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
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain uppercase, lowercase, and number',
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

          <Input
            label="Confirm Password"
            type="password"
            required
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === password || 'Passwords do not match',
            })}
          />

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-secondary-600">
            Already have an account?{' '}
            <a
              href="/auth/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in
            </a>
          </p>
        </div>
      </Card.Content>
    </Card>
  );
};

export default RegisterForm;