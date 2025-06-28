package no.chirico.quicklib.mapper

import no.chirico.quicklib.dto.BookRequest
import no.chirico.quicklib.dto.BookResponse
import no.chirico.quicklib.entity.BookEntity
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.MappingTarget

@Mapper(componentModel = "spring")
interface BookMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "timestamp", ignore = true)
    fun toEntity(request: BookRequest): BookEntity

    fun toDto(entity: BookEntity): BookResponse

    fun updateEntity(request: BookRequest, @MappingTarget entity: BookEntity)
}
