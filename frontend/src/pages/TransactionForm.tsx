import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

const txSchema = z.object({
  customer_number: z.string().min(1, "No. Pelanggan wajib diisi"),
  customer_name: z.string().min(1, "Nama Pelanggan wajib diisi"),
  amount: z.string().min(1, "Nominal wajib diisi"),
  payment_method: z.string().min(1, "Pilih metode pembayaran"),
  status: z.enum(['Pending', 'Success', 'Failed']),
});

type TxForm = z.infer<typeof txSchema>;

export const TransactionForm: React.FC = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TxForm>({
    resolver: zodResolver(txSchema),
    defaultValues: {
      status: 'Pending',
      payment_method: 'Transfer Bank',
      amount: ''
    }
  });

  // Fetch data if editing
  const { data: txData, isLoading: isFetching } = useQuery({
    queryKey: ['transaction', id],
    queryFn: async () => {
      const res = await api.get(`/transactions/${id}`);
      return res.data.data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (txData) {
      reset({
        customer_number: txData.customer_number,
        customer_name: txData.customer_name,
        amount: txData.amount.toString(),
        payment_method: txData.payment_method,
        status: txData.status,
      });
    }
  }, [txData, reset]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEdit) {
        return await api.put(`/transactions/${id}`, data);
      }
      return await api.post('/transactions', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      navigate('/');
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || 'Gagal menyimpan data');
    }
  });

  const onSubmit = (data: TxForm) => {
    const formattedData = {
      ...data,
      amount: Number(data.amount)
    };
    saveMutation.mutate(formattedData);
  };

  return (
    <div>
      <Navbar />
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="outline" style={{ padding: '0.4rem 1rem' }}>&larr; Kembali</Button>
          </Link>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
            {isEdit ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}
          </h2>
        </div>

        <Card>
          {isFetching ? (
            <div className="text-center" style={{ padding: '2rem' }}>
              <span className="loader"></span>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex gap-4">
                <Input 
                  className="w-full"
                  label="No. Pelanggan" 
                  placeholder="Misal: CUST-001"
                  {...register('customer_number')}
                  error={errors.customer_number?.message}
                />
                <Input 
                  className="w-full"
                  label="Nama Pelanggan" 
                  placeholder="Misal: Budi"
                  {...register('customer_name')}
                  error={errors.customer_name?.message}
                />
              </div>

              <Input 
                label="Nominal (Rp)" 
                type="number" 
                placeholder="50000"
                {...register('amount')}
                error={errors.amount?.message}
              />

              <div className="form-group">
                <label>Metode Pembayaran</label>
                <select className="input-field" {...register('payment_method')}>
                  <option value="Transfer Bank">Transfer Bank</option>
                  <option value="E-Wallet">E-Wallet</option>
                  <option value="Kartu Kredit">Kartu Kredit</option>
                  <option value="Retail">Retail (Minimarket)</option>
                </select>
                {errors.payment_method && <span className="error-text">{errors.payment_method.message}</span>}
              </div>

              <div className="form-group">
                <label>Status Pembayaran</label>
                <select className="input-field" {...register('status')}>
                  <option value="Pending">Pending</option>
                  <option value="Success">Success</option>
                  <option value="Failed">Failed</option>
                </select>
                {errors.status && <span className="error-text">{errors.status.message}</span>}
              </div>

              <div className="flex justify-between items-center mt-8 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                <Link to="/">
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Batal</span>
                </Link>
                <Button type="submit" isLoading={saveMutation.isPending || isSubmitting}>
                  {isEdit ? 'Simpan Perubahan' : 'Buat Transaksi'}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
