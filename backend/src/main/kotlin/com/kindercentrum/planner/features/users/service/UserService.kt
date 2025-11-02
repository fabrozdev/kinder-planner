package com.kindercentrum.planner.features.users.service

import com.kindercentrum.planner.features.users.model.dto.CreateUserDto
import com.kindercentrum.planner.features.users.model.dto.UpdateUserDto
import com.kindercentrum.planner.features.users.model.dto.UserDto
import com.kindercentrum.planner.features.users.model.entity.User
import com.kindercentrum.planner.features.users.model.mapper.UserMapper
import com.kindercentrum.planner.features.users.repository.UserRepository
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.UUID

@Service
class UserService(
    private val userRepository: UserRepository,
) {
    fun getUsers(): List<UserDto> = userRepository.findByDeletedAtIsNull().map(UserMapper.INSTANCE::toDto)

    fun create(userDto: CreateUserDto): UserDto {
        val user = userRepository.save(User(
            firstName = userDto.firstName,
            lastName = userDto.lastName,
            email = userDto.email,
        ))

        return UserMapper.INSTANCE.toDto(user)
    }

    fun update(id: UUID, user: UpdateUserDto): UserDto {
        val existingUser = userRepository.findByIdAndDeletedAtIsNull(id)
            ?: throw UserNotFoundException("User with id: $id not found")

        val updatedUser = existingUser.copy(
            firstName = user.firstName ?: existingUser.firstName,
            lastName = user.lastName ?: existingUser.lastName,
            email = user.email ?: existingUser.email,
        )

        return UserMapper.INSTANCE.toDto(userRepository.save(updatedUser))
    }

    fun delete(id: UUID): Boolean {
        val user = userRepository.findByIdAndDeletedAtIsNull(id)
            ?: throw UserNotFoundException("User with id: $id not found")

        val deleteUser = user.copy(deletedAt = Instant.now())
        userRepository.save(deleteUser)
        return true;
    }
}

class UserNotFoundException(message: String) : RuntimeException(message)

