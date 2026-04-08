import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// NUEVA FUNCIÓN: Ingreso con contraseña
export async function loginConPassword(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.error('Error:', error.message);
    alert('Error: Correo o contraseña incorrectos');
  } else {
    // Si todo está bien, lo mandamos al calendario
    window.location.href = '/calendarios/calendario-cliente.html';
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