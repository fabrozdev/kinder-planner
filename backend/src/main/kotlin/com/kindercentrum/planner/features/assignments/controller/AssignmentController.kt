package com.kindercentrum.planner.features.assignments.controller

import com.kindercentrum.planner.features.assignments.model.dto.AssignmentDto
import com.kindercentrum.planner.features.assignments.model.dto.CreateAssignmentDto
import com.kindercentrum.planner.features.assignments.service.AssignmentService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/assignments")
class AssignmentController(private val assignmentService: AssignmentService) {
    @GetMapping
    fun getAssignmentsByPlanningAndLocationId(
        @RequestParam planningId: UUID,
        @RequestParam locationId: UUID
    ): List<AssignmentDto> = assignmentService.getAssignmentsByPlanningIdAndLocationId(planningId, locationId)

    @PostMapping
    fun createAssignment(@RequestBody createAssignmentDto: CreateAssignmentDto): ResponseEntity<AssignmentDto> {
        val result = assignmentService.create(createAssignmentDto)
        return ResponseEntity(result, HttpStatus.CREATED)
    }

    @DeleteMapping("/{id}")
    fun deleteAssignment(@PathVariable id: UUID): ResponseEntity<Void> {
        assignmentService.delete(id)
        return ResponseEntity(HttpStatus.NO_CONTENT)
    }
}


