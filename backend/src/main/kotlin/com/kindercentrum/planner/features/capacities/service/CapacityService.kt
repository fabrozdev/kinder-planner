package com.kindercentrum.planner.features.capacities.service

import com.kindercentrum.planner.features.assignments.model.enums.DayOfWeek
import com.kindercentrum.planner.features.capacities.model.dto.CapacityDto
import com.kindercentrum.planner.features.capacities.model.dto.CreatePlanningCapacityDto
import com.kindercentrum.planner.features.capacities.model.entity.Capacity
import com.kindercentrum.planner.features.capacities.model.mapper.CapacityMapper
import com.kindercentrum.planner.features.capacities.repository.CapacityRepository
import com.kindercentrum.planner.features.locations.model.entity.Location
import com.kindercentrum.planner.features.locations.service.LocationService
import com.kindercentrum.planner.features.planning.model.entity.Planning
import com.kindercentrum.planner.features.planning.service.PlanningService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class CapacityService(
    private val capacityRepository: CapacityRepository,
    private val planningService: PlanningService,
    private val locationService: LocationService
) {

    fun getCapacitiesByPlanningId(planningId: UUID): List<CapacityDto> =
        capacityRepository.findByPlanningId(planningId)
            .map(CapacityMapper.INSTANCE::toDto)

    fun getCapacitiesByLocationId(locationId: UUID): List<CapacityDto> =
        capacityRepository.findByLocationId(locationId)
            .map(CapacityMapper.INSTANCE::toDto)

    fun getCapacitiesByPlanningAndLocation(planningId: UUID, locationId: UUID): List<Capacity> =
        capacityRepository.findByPlanningIdAndLocationId(planningId, locationId)

    @Transactional
    fun upsertPlanningCapacities(createPlanningCapacityDto: CreatePlanningCapacityDto): List<CapacityDto> {
        val planning = planningService.getPlanningById(createPlanningCapacityDto.planningId)
        val location = locationService.getLocationById(createPlanningCapacityDto.locationId)

        val existingCapacitiesMap = getCapacitiesByDayOfWeek(createPlanningCapacityDto.planningId, createPlanningCapacityDto.locationId)

        val capacitiesToSave = upsertCapacities(createPlanningCapacityDto, existingCapacitiesMap, planning, location)

        val savedCapacities = capacityRepository.saveAll(capacitiesToSave)
        return savedCapacities.map(CapacityMapper.INSTANCE::toDto)
    }

    fun getCapacitiesByDayOfWeek(planningId: UUID, locationId: UUID): Map<DayOfWeek, Capacity> {
        val existingCapacities = getCapacitiesByPlanningAndLocation(
            planningId,
            locationId
        )

        return  existingCapacities.associateBy { it.dayOfWeek }
    }

    private fun upsertCapacities(createPlanningCapacityDto: CreatePlanningCapacityDto, existingCapacitiesMap:  Map<DayOfWeek, Capacity>, planning: Planning, location: Location): List<Capacity> {
       return createPlanningCapacityDto.capacities.map { (dayOfWeek, dayCapacity) ->
           existingCapacitiesMap[dayOfWeek]?.let { existingCapacity ->
               // Update existing capacity
               existingCapacity.copy(
                   maxChildren = dayCapacity.maxChildren
               )
           } ?: run {
               // Create new capacity
               Capacity(
                   planning = planning,
                   location = location,
                   dayOfWeek = dayOfWeek,
                   maxChildren = dayCapacity.maxChildren
               )
           }
       }
    }
}

