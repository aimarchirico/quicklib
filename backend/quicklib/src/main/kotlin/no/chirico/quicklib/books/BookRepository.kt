package no.chirico.quicklib.books

import no.chirico.quicklib.books.BookEntity
import no.chirico.quicklib.users.UserEntity
import org.springframework.data.jpa.repository.JpaRepository

interface BookRepository : JpaRepository<BookEntity, Long> {
    fun findAllByUser(user: UserEntity): List<BookEntity>
}
