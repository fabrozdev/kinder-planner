package com.kindercentrum.planner.features.planning.controller

import com.kindercentrum.planner.features.planning.model.dto.CreatePlanningDto
import com.kindercentrum.planner.features.planning.model.dto.PlanningDto
import com.kindercentrum.planner.features.planning.model.dto.PlanningWithAssignmentDto
import com.kindercentrum.planner.features.planning.service.PlanningService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/planning")
class PlanningController(private val planningService: PlanningService) {
    @GetMapping("/location/{locationId}")
    fun getPlanningByLocationId(@PathVariable locationId: UUID): PlanningDto = planningService.getPlanning(locationId)

    @GetMapping("/{month}/{year}/{locationId}")
    fun getPlanningByMonthYearAndLocationId(@PathVariable month: Int, @PathVariable year: Int, @PathVariable locationId: UUID): PlanningWithAssignmentDto = planningService.getPlanningByMonthAndYearAndLocationId(month, year, locationId)

    @PostMapping
    fun createPlanning(@RequestBody planning: CreatePlanningDto): ResponseEntity<PlanningDto> {
        val result = planningService.create(planning)
        return ResponseEntity(result, HttpStatus.CREATED)
    }

    @DeleteMapping("/{id}")
    fun deletePlanning(@PathVariable id: UUID): ResponseEntity<Boolean> {
        planningService.delete(id)
        return ResponseEntity(HttpStatus.OK)
    }
}


