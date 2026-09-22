import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../components/form/button';
import { Input } from '../components/form/input';
import { useLogin } from '../hooks/auth/useLogin';

const loginSchema = z.object({
    email: z.email('Email inválido'),
    password: z.string(),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useLogin();

    const form = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        try {
            await login(data);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Login</h2>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <Input 
                        name="email"
                        caption={form.formState.errors.email?.message} 
                        type='email' 
                        label='Email' 
                        formRegister={form.register("email")}
                    />

                    <Input 
                        name="password"
                        caption={form.formState.errors.password?.message} 
                        type='password' 
                        formRegister={form.register("password")}
                        label='Senha' 
                    />
                    
                    <Button text='Entrar' isLoading={isLoading}/>
                </form>
            </div>
        </div>
    );
};

export default Login;
