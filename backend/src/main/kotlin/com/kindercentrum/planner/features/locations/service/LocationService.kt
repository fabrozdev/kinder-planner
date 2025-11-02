package com.kindercentrum.planner.features.locations.service

import com.kindercentrum.planner.features.locations.model.dto.CreateLocationDto
import com.kindercentrum.planner.features.locations.model.dto.LocationDto
import com.kindercentrum.planner.features.locations.model.entity.Location
import com.kindercentrum.planner.features.locations.model.mapper.LocationMapper
import com.kindercentrum.planner.features.locations.repository.LocationRepository
import org.springframework.dao.DuplicateKeyException
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class LocationService(
    private val locationRepository: LocationRepository,
) {
    fun getLocations(): List<LocationDto> = locationRepository.findByActiveIsTrue().map(LocationMapper.INSTANCE::toDto)

    fun create(locationDto: CreateLocationDto): LocationDto {
        verifyLocationAvailability(locationDto.name)
        val location = locationRepository.save(Location(
            name = locationDto.name,
        ))
        return LocationMapper.INSTANCE.toDto(location)
    }

    fun update(id: UUID, locationDto: CreateLocationDto): LocationDto {
        val existingLocation = locationRepository.findByIdAndActiveIsTrue(id)
            ?: throw LocationNotFoundException("Location with id: $id not found")
        verifyLocationAvailability(locationDto.name)

        val updatedLocation = existingLocation.copy(
            name = locationDto.name,
        )

        return LocationMapper.INSTANCE.toDto(locationRepository.save(updatedLocation))
    }

    fun delete(id: UUID): Boolean {
        val location = locationRepository.findByIdAndActiveIsTrue(id)
            ?: throw LocationNotFoundException("Location with id: $id not found")

        val deleteLocation = location.copy(active = false)
        locationRepository.save(deleteLocation)
        return true
    }

    fun verifyLocationAvailability(name: String) {
        val existingLocation = locationRepository.findByNameAndActiveIsTrue(name)
        if (existingLocation.isNotEmpty()) {
            throw LocationDuplicateKeyException("Location with name ${name} already exists")
        }
    }
}

class LocationNotFoundException(message: String) : RuntimeException(message)
class LocationDuplicateKeyException(message: String) : DuplicateKeyException(message)

