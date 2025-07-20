package no.chirico.quicklib.books

import no.chirico.quicklib.books.BookRequest
import no.chirico.quicklib.books.BookResponse
import no.chirico.quicklib.books.BookEntity
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.MappingTarget

@Mapper(componentModel = "spring")
interface BookMapper {
    fun toEntity(request: BookRequest): BookEntity
    fun toDto(entity: BookEntity): BookResponse
    fun updateEntity(request: BookRequest, @MappingTarget entity: BookEntity)
}
