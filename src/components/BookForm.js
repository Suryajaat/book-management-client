import React, { useState, useRef } from 'react';
import { Container, TextField, Button, Typography, Alert } from '@mui/material';
import ListofBook from './ListofBook';

function BookForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');
  const bookListRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous error messages
    const token = localStorage.getItem('token');

    fetch('/api/books', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, author }),
    })
      .then(response => {
        if (!response.ok) {
        return  setError("Title or Author name is empty");
        }
        return response.json();
      })
      .then(data => {
        console.log('Book added:', data);
        setTitle('');
        setAuthor('');
        if (bookListRef.current) {
          bookListRef.current.fetchBooks();
        }
      })
      .catch(err => {
        setError(err.message);
      });
  };

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        Add a New Book
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Author"
          variant="outlined"
          fullWidth
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Add Book
        </Button>
      </form>
      <ListofBook ref={bookListRef} />
    </Container>
  );
}

export default BookForm;
