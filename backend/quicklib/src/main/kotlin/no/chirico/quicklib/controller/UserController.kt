package no.chirico.quicklib.controller

import no.chirico.quicklib.dto.UserRequest
import no.chirico.quicklib.dto.UserResponse
import no.chirico.quicklib.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("api/users")
class UserController(private val userService: UserService) {

    @GetMapping("")
    fun getAllUsers(): List<UserResponse> = userService.getAllUsers()

    @PostMapping("")
    fun createUser(@RequestBody request: UserRequest): ResponseEntity<UserResponse> {
        val created = userService.createUser(request)
        return ResponseEntity(created, HttpStatus.CREATED)
    }

    @GetMapping("/{id}")
    fun getUserById(@PathVariable("id") userId: Long): ResponseEntity<UserResponse> {
        val user = userService.getUser(userId)
        return if (user != null) {
            ResponseEntity(user, HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    @PutMapping("/{id}")
    fun updateUserById(@PathVariable("id") userId: Long, @RequestBody request: UserRequest): ResponseEntity<UserResponse> {
        val updated = userService.updateUser(userId, request)
        return if (updated != null) {
            ResponseEntity(updated, HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    @DeleteMapping("/{id}")
    fun deleteUserById(@PathVariable("id") userId: Long): ResponseEntity<UserResponse> {
        return try {
            val deleted = userService.deleteUser(userId)
            val dto = userService.userMapper.toDto(deleted)
            ResponseEntity(dto, HttpStatus.OK)
        } catch (e: IllegalArgumentException) {
            ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }
}