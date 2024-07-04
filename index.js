const express = require('express');
const db = require('./dbConfig');

const app = express();
app.use(express.json()); 

//menambahkan data customer
app.post('/customer', async (req, res) => {
    try {
        const { Customer_number, Customer_name, Street, City, State, Country, Employee_ID } = req.body;

        // Validasi: Periksa apakah semua kolom yang diperlukan disediakan
        if (!Customer_number || !Customer_name || !Street || !City || !State || !Country || !Employee_ID ) {
            return res.status(400).json({ error: 'Semua kolom diperlukan' });
        }
        const result = await db.query(
            'INSERT INTO public."CUSTOMER" ("Customer_number", "Customer_name", "Street", "City", "State", "Country", "Employee_ID ") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [Customer_number, Customer_name, Street, City, State, Country, Employee_ID]
        );
        res.status(201).json({ message: 'Data pelanggan telah dimasukkan', data: result.rows[0] });
    } catch (err) {
        console.error('Error executing query:', err.message);
        console.error('Error stack trace:', err.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//menambahkan data wishlist
app.post('/wishlist', async (req, res) => {
    try {
        const { Wishlist_ID, Added_date, Customer_number } = req.body;

        // Validation: Check if required fields are provided
        if (!Wishlist_ID || !Added_date || !Customer_number) {
            return res.status(400).json({ error: 'Wishlist_ID, Added_date, and Customer_number are required fields' });
        }

        // Execute the query to insert wishlist
        const result = await db.query(
            'INSERT INTO public."WISHLIST" ("Wishlist_ID ", "Added_date ", "Customer_number") VALUES ($1, $2, $3) RETURNING *',
            [Wishlist_ID, Added_date, Customer_number]
        );

        res.status(201).json({ message: 'Data wishlist telah diinput', data: result.rows[0] });
    } catch (err) {
        console.error('Error executing query:', err.message);
        console.error('Error stack trace:', err.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//menambahkan wishlist book
app.post('/wishlist-book', async (req, res) => {
    try {
        const { WISHLIST_Wishlist_ID, BOOK_Book_number } = req.body;
        if (!WISHLIST_Wishlist_ID || !BOOK_Book_number) {
            return res.status(400).json({ error: 'WISHLIST_Wishlist_ID and BOOK_Book_number are required' });
        }
        const result = await db.query(
            'INSERT INTO public."WISHLIST_BOOK" ("WISHLIST_Wishlist_ID ", "BOOK_Book_number") VALUES ($1, $2) RETURNING *',
            [WISHLIST_Wishlist_ID, BOOK_Book_number]
        );
        res.status(201).json({ message: 'buku wishlist telah diinput', data: result.rows[0] });
    } catch (err) {
        console.error('Error executing query:', err.message);
        console.error('Error stack trace:', err.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//menampilkan semua data promosi
app.get('/promotions', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM public.promosi');

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'No promotions found' });
        }
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// menampilkan data buku berdasarkan Book_number dan all dengan function GET
app.get('/buku/:Book_number', async (req, res) => {
    try {
        const { Book_number } = req.params;
        console.log('Fetching book with Book_number:', Book_number);

        if (Book_number !== 'all') {
            const result = await db.query('SELECT * FROM public."BOOK" WHERE "Book_number" = $1', [Book_number]);

            if (result.rowCount === 0) {
                console.log('No book found with Book_number:', Book_number);
                return res.status(404).json({ error: 'Data buku tidak ditemukan' });
            }
            res.json(result.rows[0]); // Return the found book
        } else {
            const allBooks = await db.query('SELECT * FROM public."BOOK"');
            res.json(allBooks.rows);
        }
    } catch (err) {
        console.error('Error executing query:', err.message);
        console.error('Error stack trace:', err.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//menampilkan genre book
app.get('/genres', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM public."GENRE"');

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'No genres found' });
        }
        
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error executing query:', err.message);
        console.error('Error stack trace:', err.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//menampilkan review buku
app.get('/reviews/:Book_number', async (req, res) => {
    try {
        const { Book_number } = req.params;
        const result = await db.query('SELECT * FROM public."REVIEW" WHERE "Book_number" = $1', [Book_number]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'No reviews found for this Book_number' });
        }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error executing query:', err.message);
        console.error('Error stack trace:', err.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.put('/updateCustomer/:Customer_number', async (req, res) => {
    try {
        const { Customer_number } = req.params;
        const { Customer_name, Street, City, State, Country, Employee_ID } = req.body;
        if (!Customer_name || !Street || !City || !State || !Country || !Employee_ID ) {
            return res.status(400).json({ error: 'Semua kolom diperlukan' });
        }
        const result = await db.query(
            'UPDATE public."CUSTOMER" SET "Customer_name" = $1, "Street" = $2, "City" = $3, "State" = $4, "Country" = $5, "Employee_ID " = $6 WHERE "Customer_number" = $7 RETURNING *',
            [Customer_name, Street, City, State, Country, Employee_ID, Customer_number]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Pelanggan tidak ditemukan' });
        }
        res.status(200).json({ message: 'Data pelanggan diperbarui dengan sukses', data: result.rows[0] });
    } catch (err) {
        console.error('Error executing query:', err.message);
        console.error('Error stack trace:', err.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//mengganti nama dengan function PATCH
app.patch('/updateCustomerName/:Customer_number', async (req, res) => {
    try {
        const { Customer_number } = req.params;
        const { Customer_name } = req.body;
        if (!Customer_name) {
            return res.status(400).json({ error: 'Customer_name is required' });
        }
        const result = await db.query(
            'UPDATE public."CUSTOMER" SET "Customer_name" = $1 WHERE "Customer_number" = $2 RETURNING *',
            [Customer_name, Customer_number]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Customer tidak ditemukan' });
        }
        res.status(200).json({ message: 'nama customer telah terupdate', data: result.rows[0] });
    } catch (err) {
        console.error('Error executing query:', err.message);
        console.error('Error stack trace:', err.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//mengganti alamat jalan dengan function PATCH
app.patch('/updateCustomerStreet/:Customer_number', async (req, res) => {
    try {
        const { Customer_number } = req.params;
        const { Street } = req.body;
        if (!Street) {
            return res.status(400).json({ error: 'Street is required' });
        }
        const result = await db.query(
            'UPDATE public."CUSTOMER" SET "Street" = $1 WHERE "Customer_number" = $2 RETURNING *',
            [Street, Customer_number]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Customer tidak ditemukan' });
        }
        res.status(200).json({ message: 'alamat jalan customer telah terupdate', data: result.rows[0] });
    } catch (err) {
        console.error('Error executing query:', err.message);
        console.error('Error stack trace:', err.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//mengganti alamat kota dengan function PATCH
app.patch('/updateCustomerCity/:Customer_number', async (req, res) => {
    try {
        const { Customer_number } = req.params;
        const { City } = req.body;
        if (!City) {
            return res.status(400).json({ error: 'City is required' });
        }
        const result = await db.query(
            'UPDATE public."CUSTOMER" SET "City" = $1 WHERE "Customer_number" = $2 RETURNING *',
            [City, Customer_number]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Customer tidak ditemukan' });
        }
        res.status(200).json({ message: 'alamat jalan customer telah terupdate', data: result.rows[0] });
    } catch (err) {
        console.error('Error executing query:', err.message);
        console.error('Error stack trace:', err.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//menghapus data wishlist book
app.delete('/wishlist-book/:WISHLIST_Wishlist_ID', async (req, res) => {
    try {
        const { WISHLIST_Wishlist_ID } = req.params;
        const result = await db.query('DELETE FROM public."WISHLIST_BOOK" WHERE "WISHLIST_Wishlist_ID " = $1', [WISHLIST_Wishlist_ID]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Wishlist book tidak dapat ditemukan' });
        }
        // Return a success message
        res.status(200).json({ message: 'Wishlist book sudah terhapus' });
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
