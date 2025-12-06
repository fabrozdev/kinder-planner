package com.kindercentrum.planner.features.assignments.repository

import com.kindercentrum.planner.features.assignments.model.entity.Assignment
import com.kindercentrum.planner.features.assignments.model.enums.DayOfWeek
import org.springframework.data.repository.CrudRepository
import java.util.*

interface AssignmentRepository: CrudRepository<Assignment, UUID> {
    fun findByPlanningIdAndLocationId(planningId: UUID, locationId: UUID): List<Assignment>
    fun findByPlanningIdAndLocationIdAndChildIdAndDayOfWeek(
        planningId: UUID,
        locationId: UUID,
        childId: UUID,
        dayOfWeek: DayOfWeek
    ): List<Assignment>
}
