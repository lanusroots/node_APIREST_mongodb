const express = require('express')
const router = express.Router()
const Book = require('../models/book.model')

// MIDDLEWARE
const getBook = async (req, res, next) => {
    let book
    const { id } = req.params

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json(
            {
                message: 'El ID del libro no es válido'
            }
        )
    }

    try {
        book = await Book.findById(id)
        if (!book) {
            return response.status(404).json(
                {
                    message: 'El libro no fué necontrado'
                }
            )
        }
    } catch (error) {
        return response.status(500).json({ message: error.message })
    }

    res.book = book
    next()
}

// Obtener todos los libros [GET ALL]
router.get('/', async (req, res) => {
    try {
        const books = await Book.find()
        console.log('GET ALL', books)
        if (books.length === 0) {
            return res.status(204).json([])
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Crear un nuevo libro (recurso) [POST]
router.post('/', async (req, res) => {
    const { title, author, genre, publication_date } = req?.body
    if (!title || !author || !genre || !publication_date) {
        return res.status(400).json({
            message: 'Los campos título, autor, género y fecha son obligatorios'
        })
    }

    const book = new Book(
        {
            title,
            author,
            genre,
            publication_date
        }
    )

    try {
        const newBook = await book.save()
        console.log(newBook)
        res.status(200).json(newBook)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Obtener libro segun id [GET BY ID]
router.get('/:id', getBook, async (req, res) => {
    res.json(res.book)
})

// Actualizar datos de un libro [PUT]
router.put('/:id', getBook, async (req, res) => {
    try {
        const book = res.book
        book.title = req.body.title || book.title
        book.author = req.body.author || book.author
        book.genre = req.body.genre || book.genre
        book.publication_date = req.body.publication_date || book.publication_date

        const updatedBook = await book.save()
        res.json(updatedBook)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Actualizar datos de un libro [PATCH]
router.patch('/:id', getBook, async (req, res) => {
    if (!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date) {
        res.status(400).json({
            message: 'Al menos uno de estos campos debe ser enviado: Título, Género o Fecha de publicación'
        })
    }

    try {
        const book = res.book
        book.title = req.body.title || book.title
        book.author = req.body.author || book.author
        book.genre = req.body.genre || book.genre
        book.publication_date = req.body.publication_date || book.publication_date

        const updatedBook = await book.save()
        res.json(updatedBook)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Eliminar un Libro x id [DELETE]
router.delete('/:id', getBook, async (req, res) => {
    try {
        const book = res.book
        await book.deleteOne({
            _id: book._id
        })
        res.json({
            message: `El libro ${book.title} fué eliminado correctamente`
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router