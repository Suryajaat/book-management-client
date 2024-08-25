import React, { useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Container, Typography, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, Alert, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ListofBook = forwardRef((props, ref) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Stable fetchBooks function using useCallback
  const fetchBooks = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/books', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        if (response.statusText === "Unauthorized") { // Using strict equality check here
          navigate('/login');
        }
        throw new Error('Failed to fetch books');
      }

      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]); // Adding navigate to the dependency array

  // Use useImperativeHandle to expose fetchBooks to the parent component
  useImperativeHandle(ref, () => ({
    fetchBooks
  }));

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]); // Adding fetchBooks to the dependency array

  if (loading) {
    return (
      <Container sx={{ mt: 8 }}>
        <CircularProgress />
        <Typography variant="h6" component="p">
          Loading books...
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Book List
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {books.length > 0 ? (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="h6">Title</Typography></TableCell>
                <TableCell><Typography variant="h6">Author</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book._id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : (
        <Typography variant="body1" component="p">
          No books available.
        </Typography>
      )}
    </Container>
  );
});

export default ListofBook;
