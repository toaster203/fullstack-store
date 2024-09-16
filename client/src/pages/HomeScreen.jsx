import React from 'react';
import { useGetBooksQuery } from '../slices/bookSlice';
import Book from '../components/Book';
// import BookList from '../components/BookList';
import {Row, Col } from 'react-bootstrap';

const HomeScreen = () => {
  const { data: books, isLoading, error } = useGetBooksQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1>Latest Books</h1>
          <Row>
            {books.map((book) => (
              <Col key={book._id} sm={12} md={6} lg={4} xl={3}>
                <Book book={book} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  )
}

export default HomeScreen;