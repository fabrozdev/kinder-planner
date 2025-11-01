package com.kindercentrum.planner.features.users.repository

import com.kindercentrum.planner.features.users.model.entity.User
import org.springframework.data.repository.CrudRepository

interface UserRepository: CrudRepository<User, String> {
    fun findByDeletedAtIsNull(): List<User>
    fun findByIdAndDeletedAtIsNull(id: String): User?
}
