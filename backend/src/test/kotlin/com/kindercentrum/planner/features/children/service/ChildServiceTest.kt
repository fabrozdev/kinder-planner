package com.kindercentrum.planner.features.children.service

import com.kindercentrum.planner.features.children.model.dto.CreateChildDto
import com.kindercentrum.planner.features.children.model.entity.Child
import com.kindercentrum.planner.features.children.repository.ChildRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.web.multipart.MultipartFile
import java.io.ByteArrayInputStream
import java.time.Instant
import java.util.*

class ChildServiceTest {
    private val childRepository = mockk<ChildRepository>()
    private lateinit var childService: ChildService

    private val testChildId = UUID.fromString("11111111-2222-3333-4444-555555555555")

    @BeforeEach
    fun setUp() {
        childService = ChildService(childRepository)
    }

    @Test
    fun `should import new children successfully`() {
        val csvContent = """
            firstName,lastName,group
            John,Doe,GroupA
            Jane,Smith,GroupB
        """.trimIndent()

        val mockFile = mockk<MultipartFile>()
        every { mockFile.inputStream } returns ByteArrayInputStream(csvContent.toByteArray())

        // No existing children in database
        every { childRepository.findAllByDeletedAtIsNull() } returns emptyList()

        val expectedChildren = listOf(
            Child(id = UUID.randomUUID(), firstName = "John", lastName = "Doe", group = "GroupA"),
            Child(id = UUID.randomUUID(), firstName = "Jane", lastName = "Smith", group = "GroupB")
        )

        every { childRepository.saveAll(any<List<Child>>()) } returns expectedChildren

        val result = childService.importChildren(mockFile)

        assertEquals(2, result.importedCount)
        assertEquals(0, result.duplicates.size)

        verify { childRepository.findAllByDeletedAtIsNull() }
        verify { childRepository.saveAll(match<List<Child>> { list ->
            list.size == 2 &&
                    list[0].firstName == "John" && list[0].lastName == "Doe" && list[0].group == "GroupA" &&
                    list[1].firstName == "Jane" && list[1].lastName == "Smith" && list[1].group == "GroupB"
        }) }
    }

    @Test
    fun `should skip duplicate children during import`() {
        val csvContent = """
            firstName,lastName,group
            John,Doe,GroupA
            Jane,Smith,GroupB
            John,Doe,GroupC
        """.trimIndent()

        val mockFile = mockk<MultipartFile>()
        every { mockFile.inputStream } returns ByteArrayInputStream(csvContent.toByteArray())

        // John Doe already exists
        val existingChildren = listOf(
            Child(
                id = testChildId,
                firstName = "John",
                lastName = "Doe",
                group = "GroupA",
                createdAt = Instant.now()
            )
        )
        every { childRepository.findAllByDeletedAtIsNull() } returns existingChildren

        val newChild = Child(id = UUID.randomUUID(), firstName = "Jane", lastName = "Smith", group = "GroupB")
        every { childRepository.saveAll(any<List<Child>>()) } returns listOf(newChild)

        val result = childService.importChildren(mockFile)

        assertEquals(1, result.importedCount)
        assertEquals(2, result.duplicates.size)
        assertTrue(result.duplicates.any { it.firstName == "John" && it.lastName == "Doe" && it.group == "GroupA" })
        assertTrue(result.duplicates.any { it.firstName == "John" && it.lastName == "Doe" && it.group == "GroupC" })

        verify { childRepository.findAllByDeletedAtIsNull() }
        verify { childRepository.saveAll(match<List<Child>> { list ->
            list.size == 1 && list[0].firstName == "Jane" && list[0].lastName == "Smith"
        }) }
    }

    @Test
    fun `should handle empty CSV file`() {
        val csvContent = """
            firstName,lastName,group
        """.trimIndent()

        val mockFile = mockk<MultipartFile>()
        every { mockFile.inputStream } returns ByteArrayInputStream(csvContent.toByteArray())

        every { childRepository.findAllByDeletedAtIsNull() } returns emptyList()
        every { childRepository.saveAll(any<List<Child>>()) } returns emptyList()

        val result = childService.importChildren(mockFile)

        assertEquals(0, result.importedCount)
        assertEquals(0, result.duplicates.size)

        verify { childRepository.findAllByDeletedAtIsNull() }
        verify { childRepository.saveAll(emptyList()) }
    }

    @Test
    fun `should handle CSV with blank lines`() {
        val csvContent = """
            firstName,lastName,group
            John,Doe,GroupA

            Jane,Smith,GroupB

        """.trimIndent()

        val mockFile = mockk<MultipartFile>()
        every { mockFile.inputStream } returns ByteArrayInputStream(csvContent.toByteArray())

        every { childRepository.findAllByDeletedAtIsNull() } returns emptyList()

        val expectedChildren = listOf(
            Child(id = UUID.randomUUID(), firstName = "John", lastName = "Doe", group = "GroupA"),
            Child(id = UUID.randomUUID(), firstName = "Jane", lastName = "Smith", group = "GroupB")
        )
        every { childRepository.saveAll(any<List<Child>>()) } returns expectedChildren

        val result = childService.importChildren(mockFile)

        assertEquals(2, result.importedCount)
        assertEquals(0, result.duplicates.size)

        verify { childRepository.saveAll(match<List<Child>> { list -> list.size == 2 }) }
    }

    @Test
    fun `should handle all duplicate children`() {
        val csvContent = """
            firstName,lastName,group
            John,Doe,GroupA
            Jane,Smith,GroupB
        """.trimIndent()

        val mockFile = mockk<MultipartFile>()
        every { mockFile.inputStream } returns ByteArrayInputStream(csvContent.toByteArray())

        // All children already exist
        val existingChildren = listOf(
            Child(id = UUID.randomUUID(), firstName = "John", lastName = "Doe", group = "GroupA"),
            Child(id = UUID.randomUUID(), firstName = "Jane", lastName = "Smith", group = "GroupB")
        )
        every { childRepository.findAllByDeletedAtIsNull() } returns existingChildren
        every { childRepository.saveAll(any<List<Child>>()) } returns emptyList()

        val result = childService.importChildren(mockFile)

        assertEquals(0, result.importedCount)
        assertEquals(2, result.duplicates.size)

        verify { childRepository.findAllByDeletedAtIsNull() }
        verify { childRepository.saveAll(emptyList()) }
    }

    @Test
    fun `should handle mixed new and duplicate children`() {
        val csvContent = """
            firstName,lastName,group
            John,Doe,GroupA
            Jane,Smith,GroupB
            Bob,Johnson,GroupC
            Alice,Williams,GroupA
        """.trimIndent()

        val mockFile = mockk<MultipartFile>()
        every { mockFile.inputStream } returns ByteArrayInputStream(csvContent.toByteArray())

        // John and Bob already exist
        val existingChildren = listOf(
            Child(id = UUID.randomUUID(), firstName = "John", lastName = "Doe", group = "GroupA"),
            Child(id = UUID.randomUUID(), firstName = "Bob", lastName = "Johnson", group = "GroupC")
        )
        every { childRepository.findAllByDeletedAtIsNull() } returns existingChildren

        val newChildren = listOf(
            Child(id = UUID.randomUUID(), firstName = "Jane", lastName = "Smith", group = "GroupB"),
            Child(id = UUID.randomUUID(), firstName = "Alice", lastName = "Williams", group = "GroupA")
        )
        every { childRepository.saveAll(any<List<Child>>()) } returns newChildren

        val result = childService.importChildren(mockFile)

        assertEquals(2, result.importedCount)
        assertEquals(2, result.duplicates.size)

        verify { childRepository.findAllByDeletedAtIsNull() }
        verify { childRepository.saveAll(match<List<Child>> { list ->
            list.size == 2 &&
                    list.any { it.firstName == "Jane" && it.lastName == "Smith" } &&
                    list.any { it.firstName == "Alice" && it.lastName == "Williams" }
        }) }
    }

    @Test
    fun `should use batch save for large imports`() {
        val csvLines = mutableListOf("firstName,lastName,group")
        repeat(100) { i ->
            csvLines.add("Child$i,LastName$i,Group${i % 5}")
        }
        val csvContent = csvLines.joinToString("\n")

        val mockFile = mockk<MultipartFile>()
        every { mockFile.inputStream } returns ByteArrayInputStream(csvContent.toByteArray())

        every { childRepository.findAllByDeletedAtIsNull() } returns emptyList()

        val savedChildren = List(100) { i ->
            Child(id = UUID.randomUUID(), firstName = "Child$i", lastName = "LastName$i", group = "Group${i % 5}")
        }
        every { childRepository.saveAll(any<List<Child>>()) } returns savedChildren

        val result = childService.importChildren(mockFile)

        assertEquals(100, result.importedCount)
        assertEquals(0, result.duplicates.size)

        verify { childRepository.findAllByDeletedAtIsNull() }
        verify(exactly = 1) { childRepository.saveAll(match<List<Child>> { it.size == 100 }) }
    }

    @Test
    fun `should list children`() {
        val children = listOf(
            Child(
                id = testChildId,
                firstName = "John",
                lastName = "Doe",
                group = "GroupA"
            )
        )

        every { childRepository.findAllByDeletedAtIsNull() } returns children
        val result = childService.getChildren()
        assertEquals(1, result.size)
        assertEquals("John", result[0].firstName)
        assertEquals("Doe", result[0].lastName)
    }

    @Test
    fun `should create new child`() {
        val createDto = CreateChildDto(
            firstName = "John",
            lastName = "Doe",
            group = "GroupA"
        )

        val generatedId = UUID.randomUUID()
        every { childRepository.save(any<Child>()) } answers {
            val child = firstArg<Child>()
            child.copy(id = generatedId)
        }

        val result = childService.create(createDto)

        assertEquals("John", result.firstName)
        assertEquals("Doe", result.lastName)
        assertEquals("GroupA", result.group)

        verify { childRepository.save(match<Child> {
            it.firstName == "John" && it.lastName == "Doe" && it.group == "GroupA"
        }) }
    }
}