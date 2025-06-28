package no.chirico.quicklib.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import no.chirico.quicklib.dto.UserResponse
import no.chirico.quicklib.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/user")
class UserController(private val userService: UserService) {
    @Operation(summary = "Get or create the current user")
    @ApiResponse(responseCode = "200", description = "User returned or created successfully")
    @GetMapping("")
    fun getOrCreateUser(): UserResponse = userService.getOrCreateUser()

    @Operation(summary = "Delete the current user")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "204", description = "User deleted successfully"),
            ApiResponse(responseCode = "404", description = "User not found")
        ]
    )
    @DeleteMapping("")
    fun deleteUser(): ResponseEntity<Void> =
        if (userService.deleteUser()) ResponseEntity.noContent().build()
        else ResponseEntity.notFound().build()
}