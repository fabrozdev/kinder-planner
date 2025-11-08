package com.kindercentrum.planner.features.planning.service

import com.kindercentrum.planner.features.assignments.service.AssignmentService
import com.kindercentrum.planner.features.locations.repository.LocationRepository
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
import java.util.UUID

@Service
class PlanningService(
    private val planningRepository: PlanningRepository,
    private val locationRepository: LocationRepository,
    private val assignmentService: AssignmentService,
) {
    fun getPlanning(locationId: UUID): PlanningDto {
        val now = LocalDate.now()
        val currentYear = now.year
        val currentMonth = now.monthValue

        return PlanningMapper.INSTANCE.toDto(planningRepository
            .findPlanningByYearAndMonthAndLocationIdAndDeletedAtIsNull(currentYear, currentMonth, locationId))
    }

    fun getPlanningByMonthAndYearAndLocationId(month: Int, year: Int, locationId: UUID): PlanningWithAssignmentDto {
        val planning = planningRepository.findPlanningByYearAndMonthAndLocationIdAndDeletedAtIsNull(year, month, locationId)
        val planningId = planning.id ?: throw IllegalStateException("Planning should have an ID")

        val assignments = assignmentService.getAssignmentsByPlanningIdAndLocationId(planningId, locationId)

        val planningDto = PlanningMapper.INSTANCE.toDto(planning)

        return PlanningWithAssignmentDto(
            id = planningDto.id,
            year = planningDto.year,
            month = planningDto.month,
            locationId = planningDto.locationId,
            label = planningDto.label,
            assignments = assignments
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

    fun delete(id: UUID): Boolean {
        val planning = planningRepository.findByIdAndDeletedAtIsNull(id)
            ?: throw PlanningNotFoundException("Planning with id: $id not found")

        val deleteUser = planning.copy(deletedAt = Instant.now())
        planningRepository.save(deleteUser)
        return true
    }
}

class PlanningNotFoundException(message: String) : RuntimeException(message)
class PlanningAlreadyExistsException(message: String) : DuplicateKeyException(message)
class LocationNotFoundException(message: String) : RuntimeException(message)


