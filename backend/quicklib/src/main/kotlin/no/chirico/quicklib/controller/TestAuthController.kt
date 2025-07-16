package no.chirico.quicklib.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.security.core.Authentication

@RestController
@RequestMapping("/quicklib/test-auth")
class TestAuthController {
    @Operation(summary = "Test authentication and return authentication details")
    @ApiResponse(responseCode = "200", description = "Authentication status returned successfully")
    @GetMapping("")
    fun testAuth(authentication: Authentication?): Map<String, Any?> {
        println("Controller authentication: $authentication")
        return mapOf(
            "authenticated" to (authentication != null),
            "principal" to authentication?.principal
        )
    }
}
