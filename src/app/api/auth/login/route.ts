import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, password, role } = body;

    if (!nama || !password) {
      return NextResponse.json({ error: 'Nama dan password wajib diisi' }, { status: 400 });
    }

    const supabase = createClient();

    let query = supabase
      .from('profiles')
      .select('*')
      .eq('status', 'aktif');

    if (role === 'siswa') {
      // Siswa login pakai nama (case insensitive, toleransi spasi)
      const normalizedNama = nama.trim().toLowerCase();
      const { data: users, error } = await query.eq('role', 'siswa');

      if (error) throw error;

      const user = users?.find((u) => {
        const dbName = (u.full_name || '').trim().toLowerCase();
        return dbName === normalizedNama && u.password_hash === password;
      });

      if (!user) {
        return NextResponse.json({ error: 'Nama siswa atau password salah' }, { status: 401 });
      }

      return NextResponse.json({ user: sanitizeUser(user) });
    } else {
      // Guru/Admin login pakai email + password
      const { email } = body;
      if (!email) {
        return NextResponse.json({ error: 'Email wajib diisi' }, { status: 400 });
      }

      const { data: users, error } = await query.in('role', ['guru', 'admin']).eq('email', email);

      if (error) throw error;

      const user = users?.find((u) => u.password_hash === password);

      if (!user) {
        return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
      }

      return NextResponse.json({ user: sanitizeUser(user) });
    }
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

function sanitizeUser(user: Record<string, unknown>) {
  // Jangan kirim password ke client
  const { password_hash, ...safe } = user;
  void password_hash;
  return {
    ...safe,
    password: '***', // placeholder agar kode client tidak error
  };
}
