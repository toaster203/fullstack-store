import asyncHandler from '../middleware/asyncHandler.js';
import Book from '../models/bookModel.js';


// GET /api/books
const getBooks = asyncHandler(async (req, res) =>{
  const pageSize = 2;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
  ? {
      name: {
        $regex: req.query.keyword,
        $options: 'i',
      },
    }
  : {}; 
  const count = await Book.countDocuments({...keyword});
  const books = await Book.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ books, page, pages: Math.ceil(count / pageSize) });
})

// GET /api/books/:id
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    return res.json(book);
  }
  res.status(404);
  throw new Error('Resource not found');
});


// POST /api/books
const addBook = asyncHandler(async (req, res) => {
const book = new Book({
  name: 'Sample name',
  price: 0,
  user: req.user._id,
  image: '/images/sample.jpg',
  publisher: 'Sample publisher',
  category: 'Sample category',
  countInStock: 0,
  numReviews: 0,
  description: 'Sample description',
});

const addedBook = await book.save();
res.status(201).json(addedBook);
});

// PUT /api/books/:id
const updateBook = asyncHandler(async (req, res) => {
const { name, price, description, image, publisher, category, countInStock } =
  req.body;
const book = await Book.findById(req.params.id);
if (book) {
  book.name = name;
  book.price = price;
  book.description = description;
  book.image = image;
  book.publisher = publisher;
  book.category = category;
  book.countInStock = countInStock;
  const updatedBook = await book.save();
  res.json(updatedBook);
} else {
  res.status(404);
  throw new Error('Book not found');
}
}); 

// DELETE /api/books/:id
const deleteBook = asyncHandler(async (req, res) => {
const book = await Book.findById(req.params.id);

if (book) {
  await Book.deleteOne({ _id: book._id });
  res.json({ message: 'Book removed' });
} else {
  res.status(404);
  throw new Error('Book not found');
}
});


// POST /api/books/:id/reviews
const createBookReview = asyncHandler(async (req, res) => {
const { rating, comment } = req.body;
const book = await Book.findById(req.params.id);

if (book) {
  const alreadyReviewed = book.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Book already reviewed');
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  book.reviews.push(review);

  book.numReviews = book.reviews.length;

  book.rating =
    book.reviews.reduce((acc, item) => item.rating + acc, 0) /
    book.reviews.length;

  await book.save();
  res.status(201).json({ message: 'Review added' });
} else {
  res.status(404);
  throw new Error('Book not found');
}
});

// GET /api/books/top
const getTopBooks = asyncHandler(async (req, res) => {
const books = await Book.find({}).sort({ rating: -1 }).limit(3);

res.json(books);
});

export { getBooks, getBookById,addBook, updateBook, deleteBook,createBookReview,getTopBooks };