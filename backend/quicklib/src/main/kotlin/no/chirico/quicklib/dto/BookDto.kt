package no.chirico.quicklib.dto

import no.chirico.quicklib.entity.BookCollection
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
    val title: String,
    val author: String,
    val series: String?,
    val sequenceNumber: Int?,
    val language: String,
    val isbn: String?,
    val collection: BookCollection,
    val timestamp: Instant,
)
