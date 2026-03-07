
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tndoahtiiykoynlczhgy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZG9haHRpaXlrb3lubGN6aGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3ODY4OTYsImV4cCI6MjA4NTM2Mjg5Nn0.7BgD77tk1oE3BXWETlsbufilb5Cbntp7pAYurhbtmRE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
    console.log('Attempting to insert a test appointment...')

    const { data, error } = await supabase
        .from('appointments')
        .insert([
            {
                parent_name: "Script Test Parent",
                child_name: "Script Test Child",
                child_age: 5,
                email: "script@test.com",
                phone: "11999999999",
                concern: "Teste de inserção via script",
                preferred_date: new Date().toISOString().split('T')[0],
                preferred_time: "10:00",
                status: 'pending'
            },
        ])
        .select()

    if (error) {
        console.error('Error inserting appointment:', error)
    } else {
        console.log('Successfully inserted appointment:', data)
    }
}

testInsert()
