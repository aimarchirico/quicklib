package no.chirico.quicklib.books

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import no.chirico.quicklib.books.BookRequest
import no.chirico.quicklib.books.BookResponse
import no.chirico.quicklib.books.BookService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/books")
class BookController(private val bookService: BookService) {
    @Operation(summary = "Get all books for the current user")
    @ApiResponse(responseCode = "200", description = "List of books returned successfully")
    @GetMapping("")
    fun getAllBooks(): List<BookResponse> = bookService.getAllBooksForCurrentUser()

    @Operation(summary = "Get a book by its ID")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Book found"),
            ApiResponse(responseCode = "404", description = "Book not found")
        ]
    )
    @GetMapping("/{id}")
    fun getBookById(@PathVariable id: Long): ResponseEntity<BookResponse> =
        bookService.getBookById(id)?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()

    @Operation(summary = "Add a new book")
    @ApiResponse(responseCode = "200", description = "Book added successfully")
    @PostMapping("")
    fun addBook(@RequestBody request: BookRequest): BookResponse = bookService.addBook(request)

    @Operation(summary = "Update a book by its ID")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Book updated successfully"),
            ApiResponse(responseCode = "404", description = "Book not found")
        ]
    )
    @PutMapping("/{id}")
    fun updateBook(@PathVariable id: Long, @RequestBody request: BookRequest): ResponseEntity<BookResponse> =
        bookService.updateBook(id, request)?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()

    @Operation(summary = "Delete a book by its ID")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "204", description = "Book deleted successfully"),
            ApiResponse(responseCode = "404", description = "Book not found")
        ]
    )
    @DeleteMapping("/{id}")
    fun deleteBook(@PathVariable id: Long): ResponseEntity<Void> =
        if (bookService.deleteBook(id)) ResponseEntity.noContent().build() else ResponseEntity.notFound().build()
}
