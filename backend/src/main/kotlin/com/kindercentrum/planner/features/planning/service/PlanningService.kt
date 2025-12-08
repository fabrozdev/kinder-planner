package com.kindercentrum.planner.features.planning.service

import com.kindercentrum.planner.features.assignments.service.AssignmentService
import com.kindercentrum.planner.features.capacities.model.dto.CapacityDto
import com.kindercentrum.planner.features.capacities.model.dto.CreatePlanningCapacityDto
import com.kindercentrum.planner.features.capacities.model.dto.WeeklyCapacityDto
import com.kindercentrum.planner.features.capacities.service.CapacityService
import com.kindercentrum.planner.features.locations.repository.LocationRepository
import com.kindercentrum.planner.features.locations.service.LocationService
import com.kindercentrum.planner.features.planning.mapper.PlanningMapper
import com.kindercentrum.planner.features.planning.model.dto.CreatePlanningDto
import com.kindercentrum.planner.features.planning.model.dto.PlanningDto
import com.kindercentrum.planner.features.planning.model.dto.PlanningWithAssignmentDto
import com.kindercentrum.planner.features.planning.model.entity.Planning
import com.kindercentrum.planner.features.planning.repository.PlanningRepository
import org.springframework.dao.DuplicateKeyException
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.LocalDate
import java.util.*

@Service
class PlanningService(
    private val planningRepository: PlanningRepository,
    private val locationService: LocationService,
    private val locationRepository: LocationRepository,
    private val assignmentService: AssignmentService,
    private val capacityService: CapacityService,
) {
    fun getPlanning(locationId: UUID): PlanningDto {
        val now = LocalDate.now()
        val currentYear = now.year
        val currentMonth = now.monthValue

        val planning = planningRepository
            .findPlanningByYearAndMonthAndLocationIdAndDeletedAtIsNull(currentYear, currentMonth, locationId)
            ?: throw PlanningNotFoundException("Planning for $currentYear-$currentMonth at location $locationId not found")

        return PlanningMapper.INSTANCE.toDto(planning)
    }

    fun getPlanningByMonthAndYearAndLocationId(month: Int, year: Int, locationId: UUID): PlanningWithAssignmentDto {
        val planning = planningRepository.findPlanningByYearAndMonthAndLocationIdAndDeletedAtIsNull(year, month, locationId)
            ?: throw PlanningNotFoundException("Planning for $year-$month at location $locationId not found")
        val planningId = planning.id ?: throw IllegalStateException("Planning should have an ID")

        val weekCapacity = capacityService.getWeeklyCapacityByPlanningAndLocationId(planningId, locationId)

        val assignments = assignmentService.getAssignmentsByPlanningIdAndLocationId(planningId, locationId)

        val planningDto = PlanningMapper.INSTANCE.toDto(planning)

        return PlanningWithAssignmentDto(
            id = planningDto.id,
            year = planningDto.year,
            month = planningDto.month,
            locationId = planningDto.locationId,
            label = planningDto.label,
            assignments = assignments,
            weekCapacity = weekCapacity
        )
    }

    fun create(planningDto: CreatePlanningDto): PlanningDto {
        // Check if planning already exists for this year, month, and location
        val existing = planningRepository.findByYearAndMonthAndLocationIdAndDeletedAtIsNull(
            planningDto.year,
            planningDto.month,
            planningDto.locationId
        )

        if (existing != null) {
            throw PlanningAlreadyExistsException(
                "Planning for ${planningDto.year}-${planningDto.month} at location ${planningDto.locationId} already exists"
            )
        }

        // Fetch the location entity
        val location = locationRepository.findById(planningDto.locationId)
            .orElseThrow { LocationNotFoundException("Location with id ${planningDto.locationId} not found") }

        val planning = planningRepository.save(Planning(
            year = planningDto.year,
            month = planningDto.month,
            location = location,
            label = planningDto.label,
        ))
        return PlanningMapper.INSTANCE.toDto(planning)
    }

    fun upsertPlanningCapacity(createPlanningCapacityDto: CreatePlanningCapacityDto): List<CapacityDto> {
        val planning = getPlanningById(createPlanningCapacityDto.planningId)
        val location = locationService.getLocationById(createPlanningCapacityDto.locationId)
        return capacityService.upsertPlanningCapacity(createPlanningCapacityDto, planning, location)
    }

    fun getPlanningCapacityByLocationId(planningId: UUID, locationId: UUID): WeeklyCapacityDto {
        getPlanningById(planningId)
        locationService.getLocationById(locationId)
        return capacityService.getWeeklyCapacityByPlanningAndLocationId(planningId,locationId)
    }


    fun delete(id: UUID): Boolean {
        val planning = planningRepository.findByIdAndDeletedAtIsNull(id)
            ?: throw PlanningNotFoundException("Planning with id: $id not found")

        val deleteUser = planning.copy(deletedAt = Instant.now())
        planningRepository.save(deleteUser)
        return true
    }

    fun getPlanningById(id: UUID): Planning {
        val planning = planningRepository.findByIdAndDeletedAtIsNull(id)
            ?: throw PlanningNotFoundException("Planning with id: $id not found")
        return planning
    }
}

class PlanningNotFoundException(message: String) : RuntimeException(message)
class PlanningAlreadyExistsException(message: String) : DuplicateKeyException(message)
class LocationNotFoundException(message: String) : RuntimeException(message)


