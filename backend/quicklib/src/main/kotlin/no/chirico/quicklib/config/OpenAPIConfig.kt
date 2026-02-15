package no.chirico.quicklib.config

import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class OpenAPIConfig {

    @Bean
    fun customOpenAPI(
        @Value("\${info.version}") version: String
    ): OpenAPI {
        return OpenAPI()
            .info(
                Info()
                    .title("Quicklib API")
                    .version(version)
            )
    }
}
