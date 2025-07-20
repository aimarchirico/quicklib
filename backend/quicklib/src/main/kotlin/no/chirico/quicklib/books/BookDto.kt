package no.chirico.quicklib.books

import no.chirico.quicklib.books.BookCollection
import java.time.Instant

// Request DTO for creating/updating a book
// user is not included, it will be set from the authenticated user

data class BookRequest(
    val title: String,
    val author: String,
    val series: String? = null,
    val sequenceNumber: Int? = null,
    val language: String,
    val isbn: String? = null,
    val collection: BookCollection
)

data class BookResponse(
    val id: Long,
    val createdAt: Instant,
    val title: String,
    val author: String,
    val series: String?,
    val sequenceNumber: Int?,
    val language: String,
    val isbn: String?,
    val collection: BookCollection,
)
