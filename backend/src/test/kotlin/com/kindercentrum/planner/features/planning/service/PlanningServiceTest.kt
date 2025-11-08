package com.kindercentrum.planner.features.planning.service

import com.kindercentrum.planner.features.assignments.model.dto.AssignmentDto
import com.kindercentrum.planner.features.assignments.service.AssignmentService
import com.kindercentrum.planner.features.planning.model.dto.CreatePlanningDto
import com.kindercentrum.planner.features.planning.model.entity.Planning
import com.kindercentrum.planner.features.planning.repository.PlanningRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import junit.framework.TestCase.assertEquals
import junit.framework.TestCase.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.assertNotNull
import org.junit.jupiter.api.assertThrows
import java.util.*
import kotlin.test.Test

class PlanningServiceTest {
    private val planningRepository = mockk<PlanningRepository>()
    private val assignmentService = mockk<AssignmentService>()
    private lateinit var planningService: PlanningService

    private val testPlanningId = UUID.fromString("11111111-2222-3333-4444-555555555555")
    private val generatedPlanningId = UUID.fromString("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee")
    private val testLocationId = UUID.fromString("22222222-3333-4444-5555-666666666666")

    @BeforeEach
    fun setUp() {
        planningService = PlanningService(planningRepository, assignmentService)
    }

    @Test
    fun `should list all plannings`() {
        val planning = Planning(
            id = testPlanningId,
            year = 2025,
            month = 1,
            label = "January 2025"
        )

        every { planningRepository.findPlanningByYearAndMonthAndDeletedAtIsNull(any(), any()) } returns planning

        val result = planningService.getPlanning()

        assertEquals(2025, result.year)
        assertEquals(1, result.month)
        assertEquals("January 2025", result.label)

        verify { planningRepository.findPlanningByYearAndMonthAndDeletedAtIsNull(any(), any()) }
    }

    @Test
    fun `should create new planning`() {
        val createDto = CreatePlanningDto(
            year = 2025,
            month = 3,
            label = "March 2025"
        )

        every { planningRepository.findByYearAndMonthAndDeletedAtIsNull(2025, 3) } returns null
        every { planningRepository.save(any<Planning>()) } answers {
            val planning = firstArg<Planning>()
            planning.copy(id = generatedPlanningId)
        }

        val result = planningService.create(createDto)

        assertEquals(2025, result.year)
        assertEquals(3, result.month)
        assertEquals("March 2025", result.label)
        assertNotNull(result.id)

        verify { planningRepository.findByYearAndMonthAndDeletedAtIsNull(2025, 3) }
        verify { planningRepository.save(any<Planning>()) }
    }

    @Test
    fun `should throw exception when creating planning with duplicate year and month`() {
        val createDto = CreatePlanningDto(
            year = 2025,
            month = 3,
            label = "March 2025"
        )

        val existingPlanning = Planning(
            id = testPlanningId,
            year = 2025,
            month = 3,
            label = "Existing March 2025"
        )

        every { planningRepository.findByYearAndMonthAndDeletedAtIsNull(2025, 3) } returns existingPlanning

        val exception = assertThrows<PlanningAlreadyExistsException> {
            planningService.create(createDto)
        }

        assertEquals("Planning for 2025-3 already exists", exception.message)
        verify { planningRepository.findByYearAndMonthAndDeletedAtIsNull(2025, 3) }
        verify(exactly = 0) { planningRepository.save(any()) }
    }

    @Test
    fun `should allow creating planning with same year and month if previous was deleted`() {
        val createDto = CreatePlanningDto(
            year = 2025,
            month = 3,
            label = "New March 2025"
        )

        // No active planning exists (deleted one doesn't count)
        every { planningRepository.findByYearAndMonthAndDeletedAtIsNull(2025, 3) } returns null
        every { planningRepository.save(any<Planning>()) } answers {
            val planning = firstArg<Planning>()
            planning.copy(id = generatedPlanningId)
        }

        val result = planningService.create(createDto)

        assertEquals(2025, result.year)
        assertEquals(3, result.month)
        assertEquals("New March 2025", result.label)

        verify { planningRepository.findByYearAndMonthAndDeletedAtIsNull(2025, 3) }
        verify { planningRepository.save(any<Planning>()) }
    }

    @Test
    fun `should soft delete planning`() {
        val planning = Planning(
            id = testPlanningId,
            year = 2025,
            month = 4,
            label = "April 2025",
            deletedAt = null
        )

        every { planningRepository.findByIdAndDeletedAtIsNull(testPlanningId) } returns planning
        every { planningRepository.save(any<Planning>()) } answers {
            firstArg<Planning>()
        }

        val result = planningService.delete(testPlanningId)

        assertTrue(result)
        verify { planningRepository.findByIdAndDeletedAtIsNull(testPlanningId) }
        verify { planningRepository.save(match { it.deletedAt != null }) }
    }

    @Test
    fun `should throw exception when soft deleting non-existent planning`() {
        every { planningRepository.findByIdAndDeletedAtIsNull(testPlanningId) } returns null

        val exception = assertThrows<PlanningNotFoundException> {
            planningService.delete(testPlanningId)
        }

        assertEquals("Planning with id: $testPlanningId not found", exception.message)
        verify { planningRepository.findByIdAndDeletedAtIsNull(testPlanningId) }
        verify(exactly = 0) { planningRepository.save(any()) }
    }

    @Test
    fun `should throw exception when trying to delete already deleted planning`() {
        every { planningRepository.findByIdAndDeletedAtIsNull(testPlanningId) } returns null

        val exception = assertThrows<PlanningNotFoundException> {
            planningService.delete(testPlanningId)
        }

        assertEquals("Planning with id: $testPlanningId not found", exception.message)
        verify { planningRepository.findByIdAndDeletedAtIsNull(testPlanningId) }
        verify(exactly = 0) { planningRepository.save(any()) }
    }

    @Test
    fun `should get planning by month, year and location with assignments`() {
        val planning = Planning(
            id = testPlanningId,
            year = 2025,
            month = 6,
            label = "June 2025"
        )

        val assignments = listOf(
            AssignmentDto(
                id = UUID.randomUUID().toString(),
                locationId = testLocationId.toString(),
                dayOfWeek = 1,
                childId = UUID.randomUUID().toString(),
                planningId = testPlanningId.toString(),
                note = "Test assignment 1"
            ),
            AssignmentDto(
                id = UUID.randomUUID().toString(),
                locationId = testLocationId.toString(),
                dayOfWeek = 2,
                childId = UUID.randomUUID().toString(),
                planningId = testPlanningId.toString(),
                note = "Test assignment 2"
            )
        )

        every { planningRepository.findPlanningByYearAndMonthAndDeletedAtIsNull(2025, 6) } returns planning
        every { assignmentService.getAssignmentsByPlanningIdAndLocationId(testPlanningId, testLocationId) } returns assignments

        val result = planningService.getPlanningByMonthAndYearAndLocationId(6, 2025, testLocationId)

        assertEquals(testPlanningId.toString(), result.id)
        assertEquals(2025, result.year)
        assertEquals(6, result.month)
        assertEquals("June 2025", result.label)
        assertEquals(2, result.assignments.size)
        assertEquals(assignments, result.assignments)

        verify { planningRepository.findPlanningByYearAndMonthAndDeletedAtIsNull(2025, 6) }
        verify { assignmentService.getAssignmentsByPlanningIdAndLocationId(testPlanningId, testLocationId) }
    }

    @Test
    fun `should get planning with empty assignments list`() {
        val planning = Planning(
            id = testPlanningId,
            year = 2025,
            month = 7,
            label = "July 2025"
        )

        every { planningRepository.findPlanningByYearAndMonthAndDeletedAtIsNull(2025, 7) } returns planning
        every { assignmentService.getAssignmentsByPlanningIdAndLocationId(testPlanningId, testLocationId) } returns emptyList()

        val result = planningService.getPlanningByMonthAndYearAndLocationId(7, 2025, testLocationId)

        assertEquals(testPlanningId.toString(), result.id)
        assertEquals(2025, result.year)
        assertEquals(7, result.month)
        assertEquals("July 2025", result.label)
        assertEquals(0, result.assignments.size)

        verify { planningRepository.findPlanningByYearAndMonthAndDeletedAtIsNull(2025, 7) }
        verify { assignmentService.getAssignmentsByPlanningIdAndLocationId(testPlanningId, testLocationId) }
    }

    @Test
    fun `should throw IllegalStateException when planning id is null`() {
        val planning = Planning(
            id = null,  // ID is null
            year = 2025,
            month = 8,
            label = "August 2025"
        )

        every { planningRepository.findPlanningByYearAndMonthAndDeletedAtIsNull(2025, 8) } returns planning

        val exception = assertThrows<IllegalStateException> {
            planningService.getPlanningByMonthAndYearAndLocationId(8, 2025, testLocationId)
        }

        assertEquals("Planning should have an ID", exception.message)
        verify { planningRepository.findPlanningByYearAndMonthAndDeletedAtIsNull(2025, 8) }
        verify(exactly = 0) { assignmentService.getAssignmentsByPlanningIdAndLocationId(any(), any()) }
    }
}
