package no.chirico.quicklib.dto

data class UserRequest(
    val firebaseUid: String
)

data class UserResponse(
    val id: Long,
    val firebaseUid: String
)
