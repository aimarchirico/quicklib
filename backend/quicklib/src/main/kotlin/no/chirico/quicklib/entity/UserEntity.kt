package no.chirico.quicklib.entity

import jakarta.persistence.*

@Entity
@Table(name = "users")
class UserEntity(
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  val id: Long? = null,
  @Column(unique = true, nullable = false)
  var firebaseUid: String
)