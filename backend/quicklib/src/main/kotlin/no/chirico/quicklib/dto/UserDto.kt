package no.chirico.quicklib.dto

import java.time.Instant

data class UserRequest(
    val firebaseUid: String
)

data class UserResponse(
    val id: Long,
    val createdAt: Instant,
    val firebaseUid: String
)
