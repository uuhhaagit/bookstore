import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBook from './AddBook';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import './App.css';

const URL = 'https://bookstore-1adc4-default-rtdb.europe-west1.firebasedatabase.app/books';

function App() {
  const [books, setBooks] = useState([]);

  const fetchBooks = () => {
    fetch(`${URL}/.json`)
      .then(response => response.json())
      .then(data => {
        if (data) {
          setBooks(Object.keys(data).map(key => ({ ...data[key], id: key })));
        } else {
          setBooks([]);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const addBook = (newBook) => {
    fetch(`${URL}/.json`, {
      method: 'POST',
      body: JSON.stringify(newBook)
    })
      .then(() => fetchBooks())
      .catch(err => console.error(err));
  };

  const deleteBook = (id) => {
    fetch(`${URL}/${id}/.json`, { method: 'DELETE' })
      .then(() => fetchBooks())
      .catch(err => console.error(err));
  };

  const [columnDefs] = useState([
    { field: 'title', sortable: true, filter: true, flex: 2 },
    { field: 'author', sortable: true, filter: true, flex: 2 },
    { field: 'year', sortable: true, filter: true, flex: 1 },
    { field: 'isbn', sortable: true, filter: true, flex: 2 },
    { field: 'price', sortable: true, filter: true, flex: 1 },
    {
      headerName: '',
      field: 'id',
      width: 90,
      cellRenderer: (params) => (
        <IconButton onClick={() => deleteBook(params.value)} size="small" color="error">
          <DeleteIcon />
        </IconButton>
      )
    }
  ]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar>
      <AddBook addBook={addBook} />
      <div className="ag-theme-material" style={{ height: 500, width: 1000, margin: 'auto' }}>
        <AgGridReact rowData={books} columnDefs={columnDefs} />
      </div>
    </>
  );
}

export default App;