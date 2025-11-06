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

    fun importChildren(file: MultipartFile): Boolean {
        val importProcessor = ImportProcessor(CsvImportStrategy())
        val children = importProcessor.read(file.inputStream);
        children.forEach {
            println("Importing ${it.firstName} ${it.lastName}")
        }

        return true;
    }
}
