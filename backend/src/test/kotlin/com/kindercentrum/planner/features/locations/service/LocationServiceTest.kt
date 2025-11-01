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
import kotlin.test.Test

class LocationServiceTest {
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
                id = "1111-2222-3333-4444",
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
            location.copy(id = "generated-uuid-1234")
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
            id = "existing-id",
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
        val locationId = "1111-2222"
        val existingLocation = Location(
            id = locationId,
            name = "Test Location",
            active = true
        )

        val updateDto = CreateLocationDto(
            name = "Test Location 1",
        )

        every { locationRepository.findByIdAndActiveIsTrue(locationId) } returns existingLocation
        every { locationRepository.findByNameAndActiveIsTrue("Test Location 1") } returns emptyList()
        every { locationRepository.save(any<Location>()) } answers {
            val location = firstArg<Location>()
            location.copy(updatedAt = Instant.now())
        }

        val result = locationService.update(locationId, updateDto)

        assertEquals("Test Location 1", result.name)

        verify { locationRepository.findByIdAndActiveIsTrue(locationId) }
        verify { locationRepository.findByNameAndActiveIsTrue("Test Location 1") }
        verify { locationRepository.save(match {
            it.name == "Test Location 1"
        }) }
    }

    @Test
    fun `should throw exception when updating non-existent location`() {
        val locationId = "1111-2222"
        val updateDto = CreateLocationDto(
            name = "Test Location 1",
        )

        every { locationRepository.findByIdAndActiveIsTrue(locationId) } returns null

        val exception = assertThrows<LocationNotFoundException> {
            locationService.update(locationId, updateDto)
        }

        assertEquals("Location with id: $locationId not found", exception.message)
        verify { locationRepository.findByIdAndActiveIsTrue(locationId) }
        verify(exactly = 0) { locationRepository.findByNameAndActiveIsTrue(any()) }
        verify(exactly = 0) { locationRepository.save(any()) }
    }

    @Test
    fun `should throw exception when updating location with duplicate name`() {
        val locationId = "1111-2222"
        val existingLocation = Location(
            id = locationId,
            name = "Test Location",
            active = true
        )

        val duplicateLocation = Location(
            id = "another-id",
            name = "Test Location 1",
            active = true
        )

        val updateDto = CreateLocationDto(
            name = "Test Location 1",
        )

        every { locationRepository.findByIdAndActiveIsTrue(locationId) } returns existingLocation
        every { locationRepository.findByNameAndActiveIsTrue("Test Location 1") } returns listOf(duplicateLocation)

        val exception = assertThrows<LocationDuplicateKeyException> {
            locationService.update(locationId, updateDto)
        }

        assertEquals("Location with name Test Location 1 already exists", exception.message)
        verify { locationRepository.findByIdAndActiveIsTrue(locationId) }
        verify { locationRepository.findByNameAndActiveIsTrue("Test Location 1") }
        verify(exactly = 0) { locationRepository.save(any()) }
    }

    @Test
    fun `should soft delete location`() {
        val locationId = "1111-2222"
        val location = Location(
            id = locationId,
            name = "Test Location",
            active = true
        )

        every { locationRepository.findByIdAndActiveIsTrue(locationId) } returns location
        every { locationRepository.save(any<Location>()) } answers {
            firstArg<Location>()
        }

        val result = locationService.delete(locationId)

        assertTrue(result)
        verify { locationRepository.findByIdAndActiveIsTrue(locationId) }
        verify { locationRepository.save(match { it.active == false }) }
    }

    @Test
    fun `should throw exception when soft deleting non-existent location`() {
        val locationId = "1111-2222"

        every { locationRepository.findByIdAndActiveIsTrue(locationId) } returns null

        val exception = assertThrows<LocationNotFoundException> {
            locationService.delete(locationId)
        }

        assertEquals("Location with id: $locationId not found", exception.message)
        verify { locationRepository.findByIdAndActiveIsTrue(locationId) }
        verify(exactly = 0) { locationRepository.save(any()) }
    }
}
