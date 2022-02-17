const {nanoid} = require ("nanoid");
const {books} = require ("./books");

const addBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  if (name == null || name == undefined) {
    const response = h.response({
      status: 'Fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount){
    const response = h.response({
      status: 'Fail',
      message: `Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount`,
    });

    response.code(400);
    return response;
  }

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    reading,
    createdAt,
    updatedAt,
  };

  books.push(newBooks);

  const isSuccess = books.filter((buku) => buku.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);
  return response;
};

const getAllBook = (request, h) => {
  const {name, reading, finished} = request.query;

  if (name !== undefined) {
    const buku = books.filter(
        (buku) => buku.name.toLowerCase().includes(name.toLowerCase()),
    );

    const response = h.response({
      status: 'success',
      data: {
        books: buku.map((buku) => ({
          id: buku.id,
          name: buku.name,
          publisher: buku.publisher,
        }),
        ),
      },
    });

    response.code(200);
    return response;
  }

  if (reading !== undefined) {
    const buku = books.filter(
        (buku) => Number(buku.reading) === Number(reading),
    );

    const response = h.response({
      status: 'success',
      data: {
        books: buku.map((buku) => ({
          id: buku.id,
          name: buku.name,
          publisher: buku.publisher,
        }),
        ),
      },
    });

    response.code(200);
    return response;
  }

  if (finished !== undefined) {
    const buku = books.filter(
        (buku) => Number(buku.finished) === Number(finished),
    );

    const response = h.response({
      status: 'success',
      data: {
        books: buku.map((buku) => ({
          id: buku.id,
          name: buku.name,
          publisher: buku.publisher,
        }),
        ),
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: books.map((buku) => ({
        id: buku.id,
        name: buku.name,
        publisher: buku.publisher,
      }),
      ),
    },
  });

  response.code(200);
  return response;
};

const editBook = (request, h) => {
  const {bookId} = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((buku) => buku.id === bookId);

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

const getByIdBook = (request, h) => {
  const {bookId} = request.params;
  const buku = books.filter((buku) => buku.id === bookId)[0];

  if (buku !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        buku,
      },
    },
    );

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};


const deleteBook = (request, h) => {
  const {bookId} = request.params;
  const index = books.findIndex((buku) => buku.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};


module.exports = {addBook, getAllBook, editBook, getByIdBook, deleteBook};

