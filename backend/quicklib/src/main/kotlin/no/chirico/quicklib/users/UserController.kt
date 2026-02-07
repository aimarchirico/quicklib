package no.chirico.quicklib.users

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import no.chirico.quicklib.users.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/user")
class UserController(private val userService: UserService) {

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