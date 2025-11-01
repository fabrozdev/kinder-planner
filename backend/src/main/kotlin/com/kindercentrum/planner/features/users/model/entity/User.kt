package com.kindercentrum.planner.features.users.model.entity

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.Instant

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String? = null,
    val firstName: String,
    val lastName: String,
    val email: String,
    @CreatedDate
    val createdAt: Instant,
    @LastModifiedDate
    val updatedAt: Instant,
    val deletedAt: Instant?
)
