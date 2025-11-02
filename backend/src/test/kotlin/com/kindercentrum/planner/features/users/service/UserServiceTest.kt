package com.kindercentrum.planner.features.users.service

import com.kindercentrum.planner.features.users.model.dto.CreateUserDto
import com.kindercentrum.planner.features.users.model.dto.UpdateUserDto
import com.kindercentrum.planner.features.users.model.entity.User
import com.kindercentrum.planner.features.users.repository.UserRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertNotNull
import org.junit.jupiter.api.assertThrows
import java.time.Instant
import java.util.*

class UserServiceTest {
    private val userRepository = mockk<UserRepository>()
    private lateinit var userService: UserService

    private val testUserId = UUID.fromString("11111111-2222-3333-4444-555555555555")
    private val generatedUserId = UUID.fromString("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee")

    @BeforeEach
    fun setUp() {
        userService = UserService(userRepository)
    }

    @Test
    fun `should list users`() {
        val users = listOf(
            User(
                id = testUserId,
                firstName = "John",
                lastName = "Doe",
                email = "john@example.com",
            )
        )

        every { userRepository.findByDeletedAtIsNull() } returns users
        val result = userService.getUsers()
        assertEquals(1, result.size)
    }

    @Test
    fun `should create new user`() {
        val createDto = CreateUserDto(
            firstName = "John",
            lastName = "Doe",
            email = "john@example.com",
        )

        every { userRepository.save(any<User>()) } answers {
            val user = firstArg<User>()
            user.copy(id = generatedUserId)
        }

        val result = userService.create(createDto)

        assertEquals("John", result.firstName)
        assertEquals("Doe", result.lastName)
        assertEquals("john@example.com", result.email)
        assertNotNull(result.id)
        assertEquals(generatedUserId.toString(), result.id)

        verify { userRepository.save(any<User>()) }
    }

    @Test
    fun `should update user`() {
        val existingUser = User(
            id = testUserId,
            firstName = "John",
            lastName = "Doe",
            email = "john@example.com",
        )

        val updateDto = UpdateUserDto(
            firstName = "Johnny",
            lastName = "Smith",
            email = "johnny.smith@example.com",
        )

        every { userRepository.findByIdAndDeletedAtIsNull(testUserId) } returns existingUser
        every { userRepository.save(any<User>()) } answers {
            val user = firstArg<User>()
            user.copy(updatedAt = Instant.now())
        }

        val result = userService.update(testUserId, updateDto)

        assertEquals("Johnny", result.firstName)
        assertEquals("Smith", result.lastName)
        assertEquals("johnny.smith@example.com", result.email)

        verify { userRepository.findByIdAndDeletedAtIsNull(testUserId) }
        verify { userRepository.save(match {
            it.firstName == "Johnny" &&
                    it.lastName == "Smith"
        }) }
    }

    @Test
    fun `should update user with partial data`() {
        val existingUser = User(
            id = testUserId,
            firstName = "John",
            lastName = "Doe",
            email = "john@example.com",
            createdAt = Instant.now()
        )

        val updateDto = UpdateUserDto(
            firstName = "Johnny",
            lastName = null,  // Not updating
            email = null,     // Not updating
        )

        every { userRepository.findByIdAndDeletedAtIsNull(testUserId) } returns existingUser
        every { userRepository.save(any<User>()) } answers {
            firstArg<User>()
        }

        val result = userService.update(testUserId, updateDto)

        assertEquals("Johnny", result.firstName)
        assertEquals("Doe", result.lastName)  // Should remain unchanged
        assertEquals("john@example.com", result.email)  // Should remain unchanged

        verify { userRepository.findByIdAndDeletedAtIsNull(testUserId) }
        verify { userRepository.save(any()) }
    }

    @Test
    fun `should throw exception when updating non-existent user`() {
        val updateDto = UpdateUserDto(
            firstName = "Johnny",
            lastName = null,
            email = null,
        )

        every { userRepository.findByIdAndDeletedAtIsNull(testUserId) } returns null

        val exception = assertThrows<UserNotFoundException> {
            userService.update(testUserId, updateDto)
        }

        assertEquals("User with id: $testUserId not found", exception.message)
        verify { userRepository.findByIdAndDeletedAtIsNull(testUserId) }
        verify(exactly = 0) { userRepository.save(any()) }
    }

    @Test
    fun `should soft delete user`() {
        val user = User(
            id = testUserId,
            firstName = "John",
            lastName = "Doe",
            email = "john@example.com",
            createdAt = Instant.now(),
            deletedAt = null
        )

        every { userRepository.findByIdAndDeletedAtIsNull(testUserId) } returns user
        every { userRepository.save(any<User>()) } answers {
            firstArg<User>()
        }

        val result = userService.delete(testUserId)

        assertTrue(result)
        verify { userRepository.findByIdAndDeletedAtIsNull(testUserId) }
        verify { userRepository.save(match { it.deletedAt != null }) }
    }

    @Test
    fun `should throw exception when soft deleting non-existent user`() {
        every { userRepository.findByIdAndDeletedAtIsNull(testUserId) } returns null

        val exception = assertThrows<UserNotFoundException> {
            userService.delete(testUserId)
        }

        assertEquals("User with id: $testUserId not found", exception.message)
        verify { userRepository.findByIdAndDeletedAtIsNull(testUserId) }
        verify(exactly = 0) { userRepository.save(any()) }
    }
}


