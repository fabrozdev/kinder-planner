package com.kindercentrum.planner.features.children.service

import com.kindercentrum.planner.features.children.model.dto.ChildDto
import com.kindercentrum.planner.features.children.model.dto.CreateChildDto
import com.kindercentrum.planner.features.children.model.entity.Child
import com.kindercentrum.planner.features.children.model.mapper.ChildMapper
import com.kindercentrum.planner.features.children.repository.ChildRepository
import com.kindercentrum.planner.features.children.service.import.ImportProcessor
import com.kindercentrum.planner.features.children.service.import.strategies.CsvImportStrategy
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

@Service
class ChildService(
    private val childRepository: ChildRepository
) {
    @Cacheable("children")
    fun getChildren(): List<ChildDto> {
        return childRepository.findAllByDeletedAtIsNull()
            .map(ChildMapper.INSTANCE::toDto)
    }

    @CacheEvict("children", allEntries = true)
    fun create(createChildDto: CreateChildDto): ChildDto {
        val child = childRepository.save(
            Child(
                firstName = createChildDto.firstName,
                lastName = createChildDto.lastName
            )
        )
        return ChildMapper.INSTANCE.toDto(child)
    }

    @CacheEvict("children", allEntries = true)
    fun importChildren(file: MultipartFile): Int {
        val importProcessor = ImportProcessor(CsvImportStrategy())
        val childrenDtos = importProcessor.read(file.inputStream)

        val childrenEntities = childrenDtos.map { dto ->
            Child(
                firstName = dto.firstName,
                lastName = dto.lastName
            )
        }

        val savedChildren = childRepository.saveAll(childrenEntities)
        return savedChildren.count()
    }
}
