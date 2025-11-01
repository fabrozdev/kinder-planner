package com.kindercentrum.planner.features.users.service

import com.kindercentrum.planner.features.users.model.dto.CreateUserDto
import com.kindercentrum.planner.features.users.model.dto.UpdateUserDto
import com.kindercentrum.planner.features.users.model.entity.User
import com.kindercentrum.planner.features.users.repository.UserRepository
import io.mockk.MockKAnnotations
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertNotNull
import org.junit.jupiter.api.assertThrows
import java.time.Instant

class UserServiceTest {
    private val userRepository = mockk<UserRepository>()

    @InjectMockKs
    lateinit var userService: UserService

    @BeforeEach
    fun setUp() {
        MockKAnnotations.init(this)
    }

    @Test
    fun `should list users`() {
        val users = listOf(
            User(
                id = "1111-2222-3333-4444",
                firstName = "John",
                lastName = "Doe",
                email = "john@example.com",
            )
        )

        every { userRepository.findByDeletedAtIsNull() } returns users
        val result = userService.getUsers();
        assertEquals(1, result.size);
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
            // Simulate what the database would do - set the ID
            user.copy(id = "generated-uuid-1234")
        }

        val result = userService.create(createDto)

        assertEquals("John", result.firstName)
        assertEquals("Doe", result.lastName)
        assertEquals("john@example.com", result.email)
        assertNotNull(result.id)

        verify { userRepository.save(any<User>()) }
    }

    @Test
    fun `should update user`() {
        val userId = "1111-2222"
        val existingUser = User(
            id = userId,
            firstName = "John",
            lastName = "Doe",
            email = "john@example.com",
        )

        val updateDto = UpdateUserDto(
            firstName = "Johnny",
            lastName = "Smith",
            email = "johnny.smith@example.com",
        )

        every { userRepository.findByIdAndDeletedAtIsNull(userId) } returns existingUser
        every { userRepository.save(any<User>()) } answers {
            val user = firstArg<User>()
            // Simulate what JPA auditing would do - set updatedAt
            user.copy(updatedAt = Instant.now())
        }

        val result = userService.update(userId, updateDto)

        assertEquals("Johnny", result.firstName)
        assertEquals("Smith", result.lastName)
        assertEquals("johnny.smith@example.com", result.email)

        verify { userRepository.findByIdAndDeletedAtIsNull(userId) }
        verify { userRepository.save(match {
            it.firstName == "Johnny" &&
                    it.lastName == "Smith"
        }) }
    }

    @Test
    fun `should update user with partial data`() {
        val userId = "1111-2222"
        val existingUser = User(
            id = userId,
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

        every { userRepository.findByIdAndDeletedAtIsNull(userId) } returns existingUser
        every { userRepository.save(any<User>()) } answers {
            firstArg<User>()
        }

        val result = userService.update(userId, updateDto)

        assertEquals("Johnny", result.firstName)
        assertEquals("Doe", result.lastName)  // Should remain unchanged
        assertEquals("john@example.com", result.email)  // Should remain unchanged

        verify { userRepository.findByIdAndDeletedAtIsNull(userId) }
        verify { userRepository.save(any()) }
    }

    @Test
    fun `should throw exception when updating non-existent user`() {
        val userId = "1111-2222"
        val updateDto = UpdateUserDto(
            firstName = "Johnny",
            lastName = null,
            email = null,
        )

        every { userRepository.findByIdAndDeletedAtIsNull(userId) } returns null

        val exception = assertThrows<UserNotFoundException> {
            userService.update(userId, updateDto)
        }

        assertEquals("User with id: $userId not found", exception.message)
        verify { userRepository.findByIdAndDeletedAtIsNull(userId) }
        verify(exactly = 0) { userRepository.save(any()) }
    }

    @Test
    fun `should soft delete user`() {
        val userId = "1111-2222"
        val user = User(
            id = userId,
            firstName = "John",
            lastName = "Doe",
            email = "john@example.com",
            createdAt = Instant.now(),
            deletedAt = null
        )

        every { userRepository.findByIdAndDeletedAtIsNull(userId) } returns user
        every { userRepository.save(any<User>()) } answers {
            firstArg<User>()
        }

        val result = userService.delete(userId)

        assertTrue(result)
        verify { userRepository.findByIdAndDeletedAtIsNull(userId) }
        verify { userRepository.save(match { it.deletedAt != null }) }
    }

    @Test
    fun `should throw exception when soft deleting non-existent user`() {
        val userId = "1111-2222"

        every { userRepository.findByIdAndDeletedAtIsNull(userId) } returns null

        val exception = assertThrows<UserNotFoundException> {
            userService.delete(userId)
        }

        assertEquals("User with id: $userId not found", exception.message)
        verify { userRepository.findByIdAndDeletedAtIsNull(userId) }
        verify(exactly = 0) { userRepository.save(any()) }
    }
}


