package no.chirico.quicklib.service

import no.chirico.quicklib.dto.UserResponse
import no.chirico.quicklib.entity.UserEntity
import no.chirico.quicklib.mapper.UserMapper
import no.chirico.quicklib.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.security.core.context.SecurityContextHolder

@Service
class UserService(
    private val userRepository: UserRepository,
    val userMapper: UserMapper
) {

    private fun getFirebaseUid(): String =
        SecurityContextHolder.getContext().authentication.principal as String

    fun getOrCreateUser(): UserResponse {
        val firebaseUid = getFirebaseUid()
        val entity = userRepository.findByFirebaseUid(firebaseUid)
            ?: userRepository.save(UserEntity(firebaseUid = firebaseUid))
        return userMapper.toDto(entity)
    }

    fun deleteUser(): Boolean {
        val firebaseUid = getFirebaseUid()
        return userRepository.findByFirebaseUid(firebaseUid)?.let {
            userRepository.delete(it)
            true
        } ?: false
    }
    
}
