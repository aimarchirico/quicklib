package no.chirico.quicklib.mapper

import no.chirico.quicklib.dto.UserRequest
import no.chirico.quicklib.dto.UserResponse
import no.chirico.quicklib.entity.UserEntity
import org.mapstruct.Mapper
import org.mapstruct.MappingTarget

@Mapper(componentModel = "spring")
interface UserMapper {
    fun toEntity(request: UserRequest): UserEntity
    fun toDto(entity: UserEntity): UserResponse
    fun updateEntity(request: UserRequest, @MappingTarget entity: UserEntity)
}
