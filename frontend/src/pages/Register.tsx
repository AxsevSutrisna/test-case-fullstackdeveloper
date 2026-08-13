import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

const registerSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

type RegisterForm = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setErrorMsg('');
      await api.post('/auth/register', data);
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (error: any) {
      setErrorMsg(error.response?.data?.error || 'Terjadi kesalahan saat registrasi');
    }
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: '100vh', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-8">
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>SimplePG</h1>
          <p style={{ color: 'var(--text-muted)' }}>Buat akun baru</p>
        </div>
        
        <Card>
          {errorMsg && (
            <div className="mb-4" style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: 'var(--danger)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
              {errorMsg}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input 
              label="Nama Lengkap" 
              type="text" 
              placeholder="Budi Santoso"
              {...register('name')}
              error={errors.name?.message}
            />

            <Input 
              label="Email" 
              type="email" 
              placeholder="budi@example.com"
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
              Daftar
            </Button>
          </form>
          
          <div className="text-center mt-4" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Sudah punya akun? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Login di sini</Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
