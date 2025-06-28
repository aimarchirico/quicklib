package no.chirico.quicklib.repository

import no.chirico.quicklib.entity.UserEntity
import org.springframework.data.repository.JpaRepository

interface UserRepository : JpaRepository<UserEntity, Long>