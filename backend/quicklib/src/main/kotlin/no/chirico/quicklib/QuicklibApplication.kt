package no.chirico.quicklib

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class QuicklibApplication

fun main(args: Array<String>) {
	runApplication<QuicklibApplication>(*args)
}
