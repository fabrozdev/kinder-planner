package com.kindercentrum.planner.features.locations.service

import com.kindercentrum.planner.features.locations.model.dto.CreateLocationDto
import com.kindercentrum.planner.features.locations.model.entity.Location
import com.kindercentrum.planner.features.locations.repository.LocationRepository
import io.mockk.MockKAnnotations
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.mockk
import io.mockk.verify
import junit.framework.TestCase.assertEquals
import junit.framework.TestCase.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.assertNotNull
import org.junit.jupiter.api.assertThrows
import java.time.Instant
import java.util.UUID
import kotlin.test.Test

class LocationServiceTest {

    private val id = UUID.randomUUID()

    private val locationRepository = mockk<LocationRepository>()

    @InjectMockKs
    lateinit var locationService: LocationService

    @BeforeEach
    fun setUp() {
        MockKAnnotations.init(this)
    }

    @Test
    fun `should list locations`() {
        val locations = listOf(
            Location(
                id = id,
                name = "Test Location",
                active = true
            )
        )

        every { locationRepository.findByActiveIsTrue() } returns locations
        val result = locationService.getLocations()
        assertEquals(1, result.size)
        assertEquals("Test Location", result[0].name)
    }

    @Test
    fun `should create new location`() {
        val createDto = CreateLocationDto(
            name = "Test Location",
        )

        every { locationRepository.findByNameAndActiveIsTrue("Test Location") } returns emptyList()
        every { locationRepository.save(any<Location>()) } answers {
            val location = firstArg<Location>()
            location.copy(id = id)
        }

        val result = locationService.create(createDto)

        assertEquals("Test Location", result.name)
        assertNotNull(result.id)

        verify { locationRepository.findByNameAndActiveIsTrue("Test Location") }
        verify { locationRepository.save(any<Location>()) }
    }

    @Test
    fun `should throw exception when creating location with duplicate name`() {
        val createDto = CreateLocationDto(
            name = "Test Location",
        )

        val existingLocation = Location(
            id = id,
            name = "Test Location",
            active = true
        )

        every { locationRepository.findByNameAndActiveIsTrue("Test Location") } returns listOf(existingLocation)

        val exception = assertThrows<LocationDuplicateKeyException> {
            locationService.create(createDto)
        }

        assertEquals("Location with name Test Location already exists", exception.message)
        verify { locationRepository.findByNameAndActiveIsTrue("Test Location") }
        verify(exactly = 0) { locationRepository.save(any()) }
    }

    @Test
    fun `should update location`() {
        val existingLocation = Location(
            id = id,
            name = "Test Location",
            active = true
        )

        val updateDto = CreateLocationDto(
            name = "Test Location 1",
        )

        every { locationRepository.findByIdAndActiveIsTrue(id) } returns existingLocation
        every { locationRepository.findByNameAndActiveIsTrue("Test Location 1") } returns emptyList()
        every { locationRepository.save(any<Location>()) } answers {
            val location = firstArg<Location>()
            location.copy(updatedAt = Instant.now())
        }

        val result = locationService.update(id, updateDto)

        assertEquals("Test Location 1", result.name)

        verify { locationRepository.findByIdAndActiveIsTrue(id) }
        verify { locationRepository.findByNameAndActiveIsTrue("Test Location 1") }
        verify { locationRepository.save(match {
            it.name == "Test Location 1"
        }) }
    }

    @Test
    fun `should throw exception when updating non-existent location`() {
        val updateDto = CreateLocationDto(
            name = "Test Location 1",
        )

        every { locationRepository.findByIdAndActiveIsTrue(id) } returns null

        val exception = assertThrows<LocationNotFoundException> {
            locationService.update(id, updateDto)
        }

        assertEquals("Location with id: $id not found", exception.message)
        verify { locationRepository.findByIdAndActiveIsTrue(id) }
        verify(exactly = 0) { locationRepository.findByNameAndActiveIsTrue(any()) }
        verify(exactly = 0) { locationRepository.save(any()) }
    }

    @Test
    fun `should throw exception when updating location with duplicate name`() {
        val existingLocation = Location(
            id = id,
            name = "Test Location",
            active = true
        )

        val duplicateLocation = Location(
            id = id,
            name = "Test Location 1",
            active = true
        )

        val updateDto = CreateLocationDto(
            name = "Test Location 1",
        )

        every { locationRepository.findByIdAndActiveIsTrue(id) } returns existingLocation
        every { locationRepository.findByNameAndActiveIsTrue("Test Location 1") } returns listOf(duplicateLocation)

        val exception = assertThrows<LocationDuplicateKeyException> {
            locationService.update(id, updateDto)
        }

        assertEquals("Location with name Test Location 1 already exists", exception.message)
        verify { locationRepository.findByIdAndActiveIsTrue(id) }
        verify { locationRepository.findByNameAndActiveIsTrue("Test Location 1") }
        verify(exactly = 0) { locationRepository.save(any()) }
    }

    @Test
    fun `should soft delete location`() {
        val location = Location(
            id = id,
            name = "Test Location",
            active = true
        )

        every { locationRepository.findByIdAndActiveIsTrue(id) } returns location
        every { locationRepository.save(any<Location>()) } answers {
            firstArg<Location>()
        }

        val result = locationService.delete(id)

        assertTrue(result)
        verify { locationRepository.findByIdAndActiveIsTrue(id) }
        verify { locationRepository.save(match { it.active == false }) }
    }

    @Test
    fun `should throw exception when soft deleting non-existent location`() {

        every { locationRepository.findByIdAndActiveIsTrue(id) } returns null

        val exception = assertThrows<LocationNotFoundException> {
            locationService.delete(id)
        }

        assertEquals("Location with id: $id not found", exception.message)
        verify { locationRepository.findByIdAndActiveIsTrue(id) }
        verify(exactly = 0) { locationRepository.save(any()) }
    }
}
