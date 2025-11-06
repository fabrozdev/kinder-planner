package com.kindercentrum.planner.features.planning.service

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
    private lateinit var planningService: PlanningService

    private val testPlanningId = UUID.fromString("11111111-2222-3333-4444-555555555555")
    private val generatedPlanningId = UUID.fromString("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee")

    @BeforeEach
    fun setUp() {
        planningService = PlanningService(planningRepository)
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
}
