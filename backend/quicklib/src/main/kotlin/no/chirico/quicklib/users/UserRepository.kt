package no.chirico.quicklib.users

import org.springframework.data.repository.CrudRepository

interface UserRepository : CrudRepository<User, Int>