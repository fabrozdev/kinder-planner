package com.kindercentrum.planner.features.planning.service

import com.kindercentrum.planner.features.planning.mapper.PlanningMapper
import com.kindercentrum.planner.features.planning.model.dto.CreatePlanningDto
import com.kindercentrum.planner.features.planning.model.dto.PlanningDto
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
) {
    fun getPlanning(): PlanningDto {
        val now = LocalDate.now()
        val currentYear = now.year
        val currentMonth = now.monthValue

        return PlanningMapper.INSTANCE.toDto(planningRepository
            .findPlanningByYearAndMonthAndDeletedAtIsNull(currentYear, currentMonth))
    }

    fun create(planningDto: CreatePlanningDto): PlanningDto {
        val existing = planningRepository.findByYearAndMonthAndDeletedAtIsNull(planningDto.year, planningDto.month)

        if (existing != null) {
            throw PlanningAlreadyExistsException("Planning for ${planningDto.year}-${planningDto.month} already exists")
        }

        val planning = planningRepository.save(Planning(
            year = planningDto.year,
            month = planningDto.month,
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


