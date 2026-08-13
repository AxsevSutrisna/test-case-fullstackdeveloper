import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface Transaction {
  id: number;
  customer_number: string;
  customer_name: string;
  amount: number;
  payment_method: string;
  status: string;
  updated_at: string;
}

export const Dashboard: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await api.get('/transactions');
      return response.data.data as Transaction[];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Yakin ingin menghapus transaksi ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Success': return <span className="badge badge-success">Success</span>;
      case 'Failed': return <span className="badge badge-failed">Failed</span>;
      default: return <span className="badge badge-pending">Pending</span>;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Daftar Transaksi</h2>
          <Link to="/transaction/new">
            <Button>+ Tambah Transaksi</Button>
          </Link>
        </div>

        <Card>
          {isLoading && (
            <div className="text-center" style={{ padding: '3rem' }}>
              <span className="loader"></span>
              <p className="mt-4" style={{ color: 'var(--text-muted)' }}>Memuat data transaksi...</p>
            </div>
          )}

          {isError && (
            <div className="text-center" style={{ padding: '3rem', color: 'var(--danger)' }}>
              Gagal memuat data: {(error as any)?.response?.data?.error || 'Kesalahan koneksi'}
            </div>
          )}

          {!isLoading && !isError && data?.length === 0 && (
            <div className="text-center" style={{ padding: '4rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }}>📭</div>
              <p style={{ color: 'var(--text-muted)' }}>Belum ada data transaksi.</p>
              <Link to="/transaction/new">
                <Button variant="outline" className="mt-4">Buat Transaksi Pertama</Button>
              </Link>
            </div>
          )}

          {!isLoading && !isError && data && data.length > 0 && (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>No. Pelanggan</th>
                    <th>Nama</th>
                    <th>Metode</th>
                    <th>Nominal</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((tx) => (
                    <tr key={tx.id}>
                      <td><strong style={{ color: 'var(--text-main)' }}>{tx.customer_number}</strong></td>
                      <td>{tx.customer_name}</td>
                      <td>{tx.payment_method}</td>
                      <td>Rp {tx.amount.toLocaleString('id-ID')}</td>
                      <td>{getStatusBadge(tx.status)}</td>
                      <td>
                        <div className="flex gap-2">
                          <Link to={`/transaction/${tx.id}`}>
                            <Button variant="outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Edit</Button>
                          </Link>
                          <Button 
                            variant="danger" 
                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                            onClick={() => handleDelete(tx.id)}
                            disabled={deleteMutation.isPending}
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
