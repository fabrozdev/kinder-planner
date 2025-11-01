package com.kindercentrum.planner.features.users.service

import com.kindercentrum.planner.features.users.model.entity.User
import com.kindercentrum.planner.features.users.repository.UserRepository
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class UserService(
    private val userRepository: UserRepository,
) {

    fun getUsers(): List<User> = userRepository.findAll().toList();

    fun create(user: User): User {
        return userRepository.save(user);
    }

    fun update(id: String, user: User): User {
        val existingUser = userRepository.findByIdAndDeletedAtIsNull(id)
            ?: throw UserNotFoundException("User with id: $id not found")

        val updatedUser = existingUser.copy(
            firstName = user.firstName,
            lastName = user.lastName,
            email = user.email,
        )

        return userRepository.save(updatedUser)
    }

    fun delete(id: String): Boolean {
        val user = userRepository.findByIdAndDeletedAtIsNull(id)
            ?: throw UserNotFoundException("User with id: $id not found")

        val deleteUser = user.copy(deletedAt = Instant.now())
        userRepository.save(deleteUser)
        return true;
    }
}

class UserNotFoundException(message: String) : RuntimeException(message)

