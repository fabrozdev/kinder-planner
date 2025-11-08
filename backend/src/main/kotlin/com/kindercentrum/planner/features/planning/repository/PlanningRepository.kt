package com.kindercentrum.planner.features.planning.repository

import com.kindercentrum.planner.features.planning.model.entity.Planning
import org.springframework.data.repository.CrudRepository
import java.util.*

interface PlanningRepository: CrudRepository<Planning, UUID> {
    fun findByYearAndMonthAndLocationIdAndDeletedAtIsNull(year: Int, month: Int, locationId: UUID): Planning?
    fun findPlanningByYearAndMonthAndLocationIdAndDeletedAtIsNull(year: Int, month: Int, locationId: UUID): Planning
    fun findByIdAndDeletedAtIsNull(id: UUID): Planning?
}
