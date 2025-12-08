package com.kindercentrum.planner.features.capacities.service

import com.kindercentrum.planner.features.assignments.model.enums.DayOfWeek
import com.kindercentrum.planner.features.capacities.model.dto.CapacityDto
import com.kindercentrum.planner.features.capacities.model.dto.CreatePlanningCapacityDto
import com.kindercentrum.planner.features.capacities.model.dto.WeeklyCapacityDto
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
) {
    fun getWeeklyCapacityByPlanningAndLocationId(planningId: UUID, locationId: UUID): WeeklyCapacityDto {
        val capacities = getCapacitiesByDayOfWeek(planningId, locationId)
        return capacities.mapValues { (_, capacity) -> CapacityMapper.INSTANCE.toDto(capacity) }
    }

    fun getCapacitiesByPlanningAndLocationId(planningId: UUID, locationId: UUID): List<Capacity> =
        capacityRepository.findByPlanningIdAndLocationId(planningId, locationId)

    @Transactional
    fun upsertPlanningCapacity(createPlanningCapacityDto: CreatePlanningCapacityDto, planning: Planning, location: Location): List<CapacityDto> {
        val existingCapacitiesMap = getCapacitiesByDayOfWeek(createPlanningCapacityDto.planningId, createPlanningCapacityDto.locationId)

        val capacitiesToSave = upsertCapacities(createPlanningCapacityDto, existingCapacitiesMap, planning, location)

        val savedCapacities = capacityRepository.saveAll(capacitiesToSave)
        return savedCapacities.map(CapacityMapper.INSTANCE::toDto)
    }

    fun getCapacitiesByDayOfWeek(planningId: UUID, locationId: UUID): Map<DayOfWeek, Capacity> {
        val existingCapacities = getCapacitiesByPlanningAndLocationId(
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

