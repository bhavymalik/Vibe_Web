import React from 'react';
import Papa from 'papaparse';
import supabase from './supabaseClient';
import Card from './Card';

export default function FileUpload({ setCards, user }) {
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = async (e) => {
            console.log('File loaded successfully.');

            const text = e.target.result;
            console.log('File content:', text);

            const { data, errors } = Papa.parse(text, {
                header: true,
                skipEmptyLines: true
            });

            console.log('Parsed data:', data);

            if (errors.length > 0) {
                console.error('CSV parsing error:', errors);
                return;
            }

            console.log(user)
            // Add the email field to each record
            const dataWithEmail = data.map(record => ({
                ...record,
                email: user,
            }));

            console.log('Data with email:', dataWithEmail);

            // Uploading to Supabase
            const { error } = await supabase
                .from('user_data')
                .insert(dataWithEmail);

            if (error) {
                console.error('Error inserting data:', error);
            } else {
                // Update state with new cards if needed
                console.log('Data inserted successfully:', dataWithEmail);
                setCards(prevCards => [
                    ...prevCards,
                    ...dataWithEmail.map(obj => <Card key={obj.id} obj={obj} />)
                ]);            
            }
        };

        reader.readAsText(file);
    };

    return (
        <div>
            <input
                type="file"
                accept=".csv"
                id="csvFileInput"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
            />
            <label htmlFor="csvFileInput" className="labelStyle"> Import CSV File </label>
        </div>
    );
}
