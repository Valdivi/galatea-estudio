import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function enviarMagicLink(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: `${window.location.origin}/calendarios/calendario-cliente.html`,
    },
  });
  
  if (error) {
    console.error('Error:', error.message);
    alert('Error: ' + error.message);
  } else {
    alert('¡Link de acceso enviado a ' + email + '! Revisa tu correo.');
  }
}

export async function obtenerUsuario() {
  const { data, error } = await supabase.auth.getSession();
  return data?.session?.user || null;
}

export async function logout() {
  await supabase.auth.signOut();
  window.location.href = '/calendarios/login.html';
}

export { supabase };