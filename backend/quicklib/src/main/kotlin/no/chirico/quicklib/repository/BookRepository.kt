package no.chirico.quicklib.repository

import no.chirico.quicklib.entity.BookEntity
import no.chirico.quicklib.entity.UserEntity
import org.springframework.data.jpa.repository.JpaRepository

interface BookRepository : JpaRepository<BookEntity, Long> {
    fun findAllByUser(user: UserEntity): List<BookEntity>
}
