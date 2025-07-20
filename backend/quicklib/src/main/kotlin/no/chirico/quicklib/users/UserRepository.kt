package no.chirico.quicklib.users

import no.chirico.quicklib.users.UserEntity
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<UserEntity, Long> {
    fun findByFirebaseUid(firebaseUid: String): UserEntity?
}