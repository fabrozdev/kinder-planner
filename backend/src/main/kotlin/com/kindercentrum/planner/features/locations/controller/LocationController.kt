package com.kindercentrum.planner.features.locations.controller

import com.kindercentrum.planner.features.locations.model.dto.CreateLocationDto
import com.kindercentrum.planner.features.locations.model.dto.LocationDto
import com.kindercentrum.planner.features.locations.service.LocationService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/locations")
class LocationController(private val locationService: LocationService) {
    @GetMapping
    fun getLocations(): List<LocationDto> = locationService.getLocations()

    @PostMapping
    fun createLocation(@RequestBody location: CreateLocationDto): ResponseEntity<LocationDto> {
        val result = locationService.create(location)
        return ResponseEntity(result, HttpStatus.CREATED)
    }

    @PutMapping("/{id}")
    fun updateLocation(@PathVariable id: UUID, @RequestBody location: CreateLocationDto): ResponseEntity<LocationDto> {
        val updatedLocation = locationService.update(id, location)
        return ResponseEntity(updatedLocation, HttpStatus.OK)
    }

    @DeleteMapping("/{id}")
    fun deleteLocation(@PathVariable id: UUID): ResponseEntity<Boolean> {
        locationService.delete(id)
        return ResponseEntity(HttpStatus.OK)
    }
}


