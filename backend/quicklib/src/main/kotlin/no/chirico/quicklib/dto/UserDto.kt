package no.chirico.quicklib.dto

data class UserRequest(
    val name: String,
    val email: String
)

data class UserResponse(
    val id: Long,
    val name: String,
    val email: String
)
