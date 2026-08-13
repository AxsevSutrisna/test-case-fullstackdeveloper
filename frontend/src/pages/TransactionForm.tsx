import React, { useEffect, useState } from 'react';
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

const formatRupiah = (val: string | number): string => {
  if (!val) return '';
  const digits = String(val).replace(/\D/g, '');
  if (!digits) return '';
  const numberVal = parseInt(digits, 10);
  if (isNaN(numberVal) || numberVal <= 0) return '';
  return 'Rp. ' + numberVal.toLocaleString('id-ID');
};

const txSchema = z.object({
  customer_number: z.string().min(1, "No. Pelanggan wajib diisi"),
  customer_name: z.string().min(1, "Nama Pelanggan wajib diisi"),
  amount: z
    .string()
    .min(1, "Nominal wajib diisi")
    .refine((val) => {
      const num = Number(val.replace(/\D/g, ''));
      return num > 0;
    }, { message: "Nominal tidak boleh 0 atau negatif" }),
  payment_method: z.string().min(1, "Pilih metode pembayaran"),
  status: z.enum(['Pending', 'Success', 'Failed']),
});

type TxForm = z.infer<typeof txSchema>;

export const TransactionForm: React.FC = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<TxForm>({
    resolver: zodResolver(txSchema),
    defaultValues: {
      status: 'Pending',
      payment_method: 'Transfer Bank',
      amount: ''
    }
  });

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
      const msg = err.response?.data?.error || 'Gagal menyimpan data';
      setErrorMsg(msg);
    }
  });

  const onSubmit = (data: TxForm) => {
    setErrorMsg('');
    const rawDigits = data.amount.replace(/\D/g, '');
    const formattedData = {
      ...data,
      amount: Number(rawDigits)
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
          {errorMsg && (
            <div className="mb-4" style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: 'var(--danger)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
              {errorMsg}
            </div>
          )}

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
                type="text" 
                placeholder="Rp. 50.000"
                value={formatRupiah(watch('amount') || '')}
                onChange={(e) => {
                  const rawDigits = e.target.value.replace(/\D/g, '');
                  setValue('amount', rawDigits, { shouldValidate: true });
                }}
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
