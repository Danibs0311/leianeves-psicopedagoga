import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase variables in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
    console.log('--- TESTANDO CONEXÃO DE AUTENTICAÇÃO ---');
    console.log('Email:', 'danibs2109@gmail.com');
    // We don't log the password, just testing the error code

    // First, let's try to fetch user info to see if connection is ok
    console.log('\n1. Testando conexão com Supabase...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
        console.error('Erro de conexão:', sessionError.message);
    } else {
        console.log('Conexão inicial estabelecida com sucesso.');
    }

    console.log('\n2. Verificando status do usuário...');
    // We'll intentionally try a dummy password just to see what kind of error we get
    // If it's "Invalid login credentials" it means the user exists but the password/confirmation is wrong.
    // If it's a network error, we know it's something else.
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'danibs2109@gmail.com',
        password: 'DUMMY_PASSWORD_JUST_TO_TEST_ERROR',
    });

    if (error) {
        console.log('Mensagem de erro exata retornada pelo servidor:');
        console.log(error.message);
        console.log('Código do erro:', error.status);
    } else {
        console.log('Login bem sucedido! (Isso não deveria acontecer com uma senha errada)');
    }
}

testAuth();
