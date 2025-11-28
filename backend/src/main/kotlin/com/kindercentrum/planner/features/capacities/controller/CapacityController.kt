package com.kindercentrum.planner.features.capacities.controller

import com.kindercentrum.planner.features.capacities.model.dto.CapacityDto
import com.kindercentrum.planner.features.capacities.model.dto.CreateCapacityDto
import com.kindercentrum.planner.features.capacities.model.dto.CreatePlanningCapacityDto
import com.kindercentrum.planner.features.capacities.model.dto.UpdateCapacityDto
import com.kindercentrum.planner.features.capacities.service.CapacityService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/capacities")
class CapacityController(private val capacityService: CapacityService) {

    @GetMapping
    fun getAllCapacities(): List<CapacityDto> = capacityService.getAllCapacities()

    @GetMapping("/{id}")
    fun getCapacityById(@PathVariable id: UUID): CapacityDto = capacityService.getCapacityById(id)

    @GetMapping("/planning/{planningId}")
    fun getCapacitiesByPlanningId(@PathVariable planningId: UUID): List<CapacityDto> =
        capacityService.getCapacitiesByPlanningId(planningId)

    @GetMapping("/location/{locationId}")
    fun getCapacitiesByLocationId(@PathVariable locationId: UUID): List<CapacityDto> =
        capacityService.getCapacitiesByLocationId(locationId)

    @GetMapping("/planning/{planningId}/location/{locationId}")
    fun getCapacitiesByPlanningAndLocation(
        @PathVariable planningId: UUID,
        @PathVariable locationId: UUID
    ): List<CapacityDto> = capacityService.getCapacitiesByPlanningAndLocation(planningId, locationId)

    @PostMapping
    fun createCapacity(@RequestBody createCapacityDto: CreateCapacityDto): ResponseEntity<CapacityDto> {
        val result = capacityService.create(createCapacityDto)
        return ResponseEntity(result, HttpStatus.CREATED)
    }

    @PostMapping("/planning")
    fun createPlanningCapacities(@RequestBody createPlanningCapacityDto: CreatePlanningCapacityDto): ResponseEntity<List<CapacityDto>> {
        val result = capacityService.createPlanningCapacities(createPlanningCapacityDto)
        return ResponseEntity(result, HttpStatus.CREATED)
    }

    @PutMapping("/{id}")
    fun updateCapacity(
        @PathVariable id: UUID,
        @RequestBody updateCapacityDto: UpdateCapacityDto
    ): ResponseEntity<CapacityDto> {
        val updatedCapacity = capacityService.update(id, updateCapacityDto)
        return ResponseEntity(updatedCapacity, HttpStatus.OK)
    }

    @DeleteMapping("/{id}")
    fun deleteCapacity(@PathVariable id: UUID): ResponseEntity<Boolean> {
        capacityService.delete(id)
        return ResponseEntity(HttpStatus.OK)
    }
}
