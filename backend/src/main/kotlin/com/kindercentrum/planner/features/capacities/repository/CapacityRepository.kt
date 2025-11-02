package com.kindercentrum.planner.features.capacities.repository

import com.kindercentrum.planner.features.assignments.model.enum.DayOfWeek
import com.kindercentrum.planner.features.capacities.model.entity.Capacity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface CapacityRepository : JpaRepository<Capacity, UUID> {
    fun findByPlanningIdAndLocationId(planningId: UUID, locationId: UUID): List<Capacity>

    fun findByPlanningIdAndLocationIdAndDayOfWeek(
        planningId: UUID,
        locationId: UUID,
        dayOfWeek: DayOfWeek
    ): Capacity?

    fun findByLocationId(locationId: UUID): List<Capacity>
}
