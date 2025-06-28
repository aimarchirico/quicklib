package no.chirico.quicklib.entity

import jakarta.persistence.*

@Entity
@Table(name = "users")
class UserEntity(
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  val id: Long? = null,
  var name: String,
  var email: String
)