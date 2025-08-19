// pages/api/admin/add-developer.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Load environment variables for the service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Use the admin client to create the user in auth.users table
    const { data: { user }, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // 2. Insert the user's profile with the 'developer' role
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { id: user?.id, email: user?.email, name: name, role: 'developer' },
      ]);

    if (profileError) {
      // Clean up the created auth user if the profile insertion fails
      await supabase.auth.admin.deleteUser(user?.id!);
      return res.status(500).json({ error: 'Failed to create user profile' });
    }

    res.status(200).json({ message: 'Developer added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}