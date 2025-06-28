package no.chirico.quicklib.service

import no.chirico.quicklib.dto.UserRequest
import no.chirico.quicklib.dto.UserResponse
import no.chirico.quicklib.entity.UserEntity
import no.chirico.quicklib.mapper.UserMapper
import no.chirico.quicklib.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository,
    val userMapper: UserMapper
) {
    fun createUser(request: UserRequest): UserResponse {
        val entity = userMapper.toEntity(request)
        val saved = userRepository.save(entity)
        return userMapper.toDto(saved)
    }

    fun getUser(id: Long): UserResponse? {
        val entity = userRepository.findById(id).orElseThrow { IllegalArgumentException("User not found") }
        return userMapper.toDto(entity)
    }

    fun getAllUsers(): List<UserResponse> =
        userRepository.findAll().map { userMapper.toDto(it ) }
    
    fun updateUser(id: Long, request: UserRequest): UserResponse? {
        val existing = userRepository.findById(id).orElseThrow { IllegalArgumentException("User not found") }
        userMapper.updateEntity(request, existing)
        val saved = userRepository.save(existing)
        return userMapper.toDto(saved)
    }

    fun deleteUser(id: Long): UserEntity {
        val entity = userRepository.findById(id).orElseThrow { IllegalArgumentException("User not found") }
        userRepository.delete(entity)
        return entity
    }
}
