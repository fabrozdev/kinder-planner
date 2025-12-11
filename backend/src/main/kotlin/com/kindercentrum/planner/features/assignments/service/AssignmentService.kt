package com.kindercentrum.planner.features.assignments.service

import com.kindercentrum.planner.features.assignments.model.dto.AssignmentDto
import com.kindercentrum.planner.features.assignments.model.dto.CreateAssignmentDto
import com.kindercentrum.planner.features.assignments.model.entity.Assignment
import com.kindercentrum.planner.features.assignments.model.enums.DayOfWeek
import com.kindercentrum.planner.features.assignments.model.mapper.AssignmentMapper
import com.kindercentrum.planner.features.assignments.repository.AssignmentRepository
import com.kindercentrum.planner.features.children.repository.ChildRepository
import com.kindercentrum.planner.features.locations.service.LocationService
import com.kindercentrum.planner.features.planning.repository.PlanningRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.Cacheable
import org.springframework.dao.DuplicateKeyException
import org.springframework.stereotype.Service
import java.util.*

@Service
class AssignmentService(
    private val assignmentRepository: AssignmentRepository,
    private val locationService: LocationService,
    private val childRepository: ChildRepository,
    private val planningRepository: PlanningRepository,
) {
    @Cacheable(value = ["assignments"], key = "#planningId + '_' + #locationId")
    fun getAssignmentsByPlanningIdAndLocationId(planningId: UUID, locationId: UUID): List<AssignmentDto> =
        assignmentRepository.findByPlanningIdAndLocationId(planningId, locationId).map(
            AssignmentMapper.INSTANCE::toDto)

    @CacheEvict(value = ["assignments"], key = "#assignmentDto.planningId + '_' + #assignmentDto.locationId")
    fun create(assignmentDto: CreateAssignmentDto): AssignmentDto {
        val locationId = UUID.fromString(assignmentDto.locationId)
        val childId = UUID.fromString(assignmentDto.childId)
        val planningId = UUID.fromString(assignmentDto.planningId)

        val location = locationService.getLocationById(locationId);

        val child = childRepository.findById(childId).orElseThrow {
            EntityNotFoundException("Child with id $childId not found")
        }
        val planning = planningRepository.findById(planningId).orElseThrow {
            EntityNotFoundException("Planning with id $planningId not found")
        }

        // Convert Int to DayOfWeek enum
        val dayOfWeek = DayOfWeek.entries[assignmentDto.dayOfWeek]

        // Verify assignment availability
        verifyAssignmentAvailability(planningId, locationId, childId, dayOfWeek)

        // Create and save the assignment
        val assignment = assignmentRepository.save(
            Assignment(
                location = location,
                dayOfWeek = dayOfWeek,
                child = child,
                planning = planning,
                note = assignmentDto.note
            )
        )
        return AssignmentMapper.INSTANCE.toDto(assignment)
    }

    fun delete(id: UUID): Boolean {
        val assignment = assignmentRepository.findById(id).orElseThrow {
            AssignmentNotFoundException("Assignment with id $id not found")
        }
        assignmentRepository.delete(assignment)
        return true
    }

    private fun verifyAssignmentAvailability(
        planningId: UUID,
        locationId: UUID,
        childId: UUID,
        dayOfWeek: DayOfWeek
    ) {
        val existingAssignments = assignmentRepository.findByPlanningIdAndLocationIdAndChildIdAndDayOfWeek(
            planningId,
            locationId,
            childId,
            dayOfWeek
        )
        if (existingAssignments.isNotEmpty()) {
            throw AssignmentDuplicateException(
                "Assignment already exists for child $childId at location $locationId on ${dayOfWeek.name} in planning $planningId"
            )
        }
    }
}

class AssignmentDuplicateException(message: String) : DuplicateKeyException(message)
class AssignmentNotFoundException(message: String) : EntityNotFoundException(message)

