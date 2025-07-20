package no.chirico.quicklib.users

import no.chirico.quicklib.users.UserRequest
import no.chirico.quicklib.users.UserResponse
import no.chirico.quicklib.users.UserEntity
import org.mapstruct.Mapper
import org.mapstruct.MappingTarget

@Mapper(componentModel = "spring")
interface UserMapper {
    fun toEntity(request: UserRequest): UserEntity
    fun toDto(entity: UserEntity): UserResponse
    fun updateEntity(request: UserRequest, @MappingTarget entity: UserEntity)
}
