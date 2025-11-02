package com.kindercentrum.planner.features.planning.repository

import com.kindercentrum.planner.features.planning.model.entity.Planning
import org.springframework.data.repository.CrudRepository
import java.util.*

interface PlanningRepository: CrudRepository<Planning, UUID> {
    fun findByYearAndMonthAndDeletedAtIsNull(year: Int, month: Int): Planning?
    fun findPlanningByYearAndMonthAndDeletedAtIsNull(year: Int, month: Int): List<Planning>
    fun findByIdAndDeletedAtIsNull(id: UUID): Planning?
}
