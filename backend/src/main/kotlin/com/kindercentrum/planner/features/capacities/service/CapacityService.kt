package com.kindercentrum.planner.features.capacities.service

import com.kindercentrum.planner.features.assignments.model.enums.DayOfWeek
import com.kindercentrum.planner.features.capacities.model.dto.CapacityDto
import com.kindercentrum.planner.features.capacities.model.dto.CreateCapacityDto
import com.kindercentrum.planner.features.capacities.model.dto.CreatePlanningCapacityDto
import com.kindercentrum.planner.features.capacities.model.dto.UpdateCapacityDto
import com.kindercentrum.planner.features.capacities.model.entity.Capacity
import com.kindercentrum.planner.features.capacities.model.mapper.CapacityMapper
import com.kindercentrum.planner.features.capacities.repository.CapacityRepository
import com.kindercentrum.planner.features.locations.repository.LocationRepository
import com.kindercentrum.planner.features.planning.repository.PlanningRepository
import org.springframework.dao.DuplicateKeyException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class CapacityService(
    private val capacityRepository: CapacityRepository,
    private val planningRepository: PlanningRepository,
    private val locationRepository: LocationRepository
) {

    fun getAllCapacities(): List<CapacityDto> =
        capacityRepository.findAll()
            .map(CapacityMapper.INSTANCE::toDto)

    fun getCapacityById(id: UUID): CapacityDto {
        val capacity = capacityRepository.findById(id)
            .orElseThrow { CapacityNotFoundException("Capacity with id: $id not found") }
        return CapacityMapper.INSTANCE.toDto(capacity)
    }

    fun getCapacitiesByPlanningId(planningId: UUID): List<CapacityDto> =
        capacityRepository.findByPlanningId(planningId)
            .map(CapacityMapper.INSTANCE::toDto)

    fun getCapacitiesByLocationId(locationId: UUID): List<CapacityDto> =
        capacityRepository.findByLocationId(locationId)
            .map(CapacityMapper.INSTANCE::toDto)

    fun getCapacitiesByPlanningAndLocation(planningId: UUID, locationId: UUID): List<CapacityDto> =
        capacityRepository.findByPlanningIdAndLocationId(planningId, locationId)
            .map(CapacityMapper.INSTANCE::toDto)

    fun create(createCapacityDto: CreateCapacityDto): CapacityDto {
        // Verify planning exists
        val planning = planningRepository.findByIdAndDeletedAtIsNull(createCapacityDto.planningId)
            ?: throw PlanningNotFoundException("Planning with id: ${createCapacityDto.planningId} not found")

        // Verify location exists
        val location = locationRepository.findByIdAndActiveIsTrue(createCapacityDto.locationId)
            ?: throw LocationNotFoundException("Location with id: ${createCapacityDto.locationId} not found")

        // Check if capacity already exists for this combination
        val existingCapacity = capacityRepository.findByPlanningIdAndLocationIdAndDayOfWeek(
            createCapacityDto.planningId,
            createCapacityDto.locationId,
            createCapacityDto.dayOfWeek
        )

        if (existingCapacity != null) {
            throw CapacityDuplicateKeyException(
                "Capacity already exists for planning: ${createCapacityDto.planningId}, " +
                        "location: ${createCapacityDto.locationId}, " +
                        "day: ${createCapacityDto.dayOfWeek}"
            )
        }

        val capacity = Capacity(
            planning = planning,
            location = location,
            dayOfWeek = createCapacityDto.dayOfWeek,
            maxChildren = createCapacityDto.maxChildren
        )

        val savedCapacity = capacityRepository.save(capacity)
        return CapacityMapper.INSTANCE.toDto(savedCapacity)
    }

    fun update(id: UUID, updateCapacityDto: UpdateCapacityDto): CapacityDto {
        val existingCapacity = capacityRepository.findById(id)
            .orElseThrow { CapacityNotFoundException("Capacity with id: $id not found") }

        // Fetch planning if planningId is provided
        val planning = updateCapacityDto.planningId?.let {
            planningRepository.findByIdAndDeletedAtIsNull(it)
                ?: throw PlanningNotFoundException("Planning with id: $it not found")
        } ?: existingCapacity.planning

        // Fetch location if locationId is provided
        val location = updateCapacityDto.locationId?.let {
            locationRepository.findByIdAndActiveIsTrue(it)
                ?: throw LocationNotFoundException("Location with id: $it not found")
        } ?: existingCapacity.location

        val dayOfWeek = updateCapacityDto.dayOfWeek ?: existingCapacity.dayOfWeek
        val maxChildren = updateCapacityDto.maxChildren ?: existingCapacity.maxChildren

        // Check for duplicates if key fields changed
        if (planning.id != existingCapacity.planning.id ||
            location.id != existingCapacity.location.id ||
            dayOfWeek != existingCapacity.dayOfWeek
        ) {
            val duplicateCapacity = capacityRepository.findByPlanningIdAndLocationIdAndDayOfWeek(
                planning.id!!,
                location.id!!,
                dayOfWeek
            )

            if (duplicateCapacity != null && duplicateCapacity.id != id) {
                throw CapacityDuplicateKeyException(
                    "Capacity already exists for planning: ${planning.id}, " +
                            "location: ${location.id}, " +
                            "day: $dayOfWeek"
                )
            }
        }

        val updatedCapacity = existingCapacity.copy(
            planning = planning,
            location = location,
            dayOfWeek = dayOfWeek,
            maxChildren = maxChildren
        )

        return CapacityMapper.INSTANCE.toDto(capacityRepository.save(updatedCapacity))
    }

    fun delete(id: UUID): Boolean {
        val capacity = capacityRepository.findById(id)
            .orElseThrow { CapacityNotFoundException("Capacity with id: $id not found") }

        capacityRepository.delete(capacity)
        return true
    }

    @Transactional
    fun createPlanningCapacities(createPlanningCapacityDto: CreatePlanningCapacityDto): List<CapacityDto> {
        // Verify planning exists
        val planning = planningRepository.findByIdAndDeletedAtIsNull(createPlanningCapacityDto.planningId)
            ?: throw PlanningNotFoundException("Planning with id: ${createPlanningCapacityDto.planningId} not found")

        // Verify location exists
        val location = locationRepository.findByIdAndActiveIsTrue(createPlanningCapacityDto.locationId)
            ?: throw LocationNotFoundException("Location with id: ${createPlanningCapacityDto.locationId} not found")

        // Check for existing capacities for this planning and location
        val existingCapacities = capacityRepository.findByPlanningIdAndLocationId(
            createPlanningCapacityDto.planningId,
            createPlanningCapacityDto.locationId
        )

        if (existingCapacities.isNotEmpty()) {
            throw CapacityDuplicateKeyException(
                "Capacities already exist for planning: ${createPlanningCapacityDto.planningId} " +
                        "and location: ${createPlanningCapacityDto.locationId}"
            )
        }

        // Create capacities for each day
        val capacitiesToCreate = createPlanningCapacityDto.capacities.map { (dayOfWeek, dayCapacity) ->
            Capacity(
                planning = planning,
                location = location,
                dayOfWeek = dayOfWeek,
                maxChildren = dayCapacity.maxChildren
            )
        }

        val savedCapacities = capacityRepository.saveAll(capacitiesToCreate)
        return savedCapacities.map(CapacityMapper.INSTANCE::toDto)
    }
}

class CapacityNotFoundException(message: String) : RuntimeException(message)
class CapacityDuplicateKeyException(message: String) : DuplicateKeyException(message)
class PlanningNotFoundException(message: String) : RuntimeException(message)
class LocationNotFoundException(message: String) : RuntimeException(message)