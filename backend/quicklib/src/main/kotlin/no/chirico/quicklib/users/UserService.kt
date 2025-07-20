package no.chirico.quicklib.users

import no.chirico.quicklib.users.UserResponse
import no.chirico.quicklib.users.UserEntity
import no.chirico.quicklib.users.UserMapper
import no.chirico.quicklib.users.UserRepository
import org.springframework.stereotype.Service
import org.springframework.security.core.context.SecurityContextHolder

@Service
class UserService(
    private val userRepository: UserRepository
) {

    private fun getFirebaseUid(): String =
        SecurityContextHolder.getContext().authentication.principal as String

    fun getOrCreateUserEntity(): UserEntity {
        val firebaseUid = getFirebaseUid()
        return userRepository.findByFirebaseUid(firebaseUid)
            ?: userRepository.save(UserEntity(firebaseUid = firebaseUid))
    }

    fun deleteUser(): Boolean {
        val firebaseUid = getFirebaseUid()
        return userRepository.findByFirebaseUid(firebaseUid)?.let {
            userRepository.delete(it)
            true
        } ?: false
    }
    


}
