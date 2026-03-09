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

async function testAppointment() {
    console.log('--- TESTANDO INTEGRAÇÃO GOOGLE CALENDAR (MAKE) ---');
    console.log('Inserindo agendamento falso no Supabase...\n');

    // Data de amanhã para o teste
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('appointments')
        .insert([
            {
                parent_name: 'Robotinho Teste',
                child_name: 'Make.com',
                child_age: 12,
                cpf: '00000000000',
                email: 'automacao@clinica.com',
                phone: '11999999999',
                concern: 'Teste automatizado de integração com Google Agenda',
                preferred_date: dateStr,
                preferred_time: '14:00',
                status: 'pending'
            }
        ])
        .select();

    if (error) {
        console.error('❌ Erro ao inserir no banco:', error.message);
    } else {
        console.log('✅ Agendamento inserido com sucesso!');
        console.log('Dados:', data[0]);
        console.log('\n🌟 Dê uma olhada na sua Agenda do Google (dia de amanhã às 14:00)!');
    }
}

testAppointment();
