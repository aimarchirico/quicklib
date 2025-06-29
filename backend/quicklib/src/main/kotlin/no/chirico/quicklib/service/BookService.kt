package no.chirico.quicklib.service

import no.chirico.quicklib.dto.BookRequest
import no.chirico.quicklib.dto.BookResponse
import no.chirico.quicklib.entity.BookEntity
import no.chirico.quicklib.mapper.BookMapper
import no.chirico.quicklib.repository.BookRepository
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class BookService(
    private val bookRepository: BookRepository,
    private val bookMapper: BookMapper,
    private val userService: UserService
) {
    private fun validateBookOwnership(id: Long): BookEntity? {
        val user = userService.getOrCreateUserEntity()
        val entity = bookRepository.findById(id).orElse(null)
        return if (entity != null && entity.user == user) entity else null
    }

    fun getAllBooksForCurrentUser(): List<BookResponse> =
        bookRepository.findAllByUser(userService.getOrCreateUserEntity()).map { bookMapper.toDto(it) }

    fun getBookById(id: Long): BookResponse? =
        validateBookOwnership(id)?.let { bookMapper.toDto(it) }

    fun addBook(request: BookRequest): BookResponse {
        val user = userService.getOrCreateUserEntity()
        val entity = bookMapper.toEntity(request).copy(user = user)
        return bookMapper.toDto(bookRepository.save(entity))
    }

    fun updateBook(id: Long, request: BookRequest): BookResponse? {
        val entity = validateBookOwnership(id) ?: return null
        bookMapper.updateEntity(request, entity)
        return bookMapper.toDto(bookRepository.save(entity))
    }

    fun deleteBook(id: Long): Boolean {
        val entity = validateBookOwnership(id) ?: return false
        bookRepository.delete(entity)
        return true
    }
}
