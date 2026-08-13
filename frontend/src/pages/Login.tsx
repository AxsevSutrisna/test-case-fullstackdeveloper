import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { setToken, setUser } from '../utils/auth';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(1, { message: "Password wajib diisi" }),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setErrorMsg('');
      const response = await api.post('/auth/login', data);
      
      if (response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
        navigate('/');
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.error || 'Terjadi kesalahan saat login');
    }
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: '100vh', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-8">
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>SimplePG</h1>
          <p style={{ color: 'var(--text-muted)' }}>Masuk ke akun Anda</p>
        </div>
        
        <Card>
          {errorMsg && (
            <div className="mb-4" style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: 'var(--danger)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
              {errorMsg}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input 
              label="Email" 
              type="email" 
              placeholder="admin@test.com"
              {...register('email')}
              error={errors.email?.message}
            />
            
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />
            
            <Button type="submit" className="w-full mt-4" isLoading={isSubmitting}>
              Login
            </Button>
          </form>
          
          <div className="text-center mt-4" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Belum punya akun? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>Daftar sekarang</Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
