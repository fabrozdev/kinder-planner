package com.kindercentrum.planner.features.children.controller

import com.kindercentrum.planner.features.children.model.dto.ChildDto
import com.kindercentrum.planner.features.children.model.dto.CreateChildDto
import com.kindercentrum.planner.features.children.service.ChildService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/children")
class ChildController(private val childService: ChildService) {
    @GetMapping
    fun getChildren(): List<ChildDto> = childService.getChildren()

    @PostMapping
    fun createChild(@RequestBody createChildDto: CreateChildDto): ResponseEntity<ChildDto> {
        val result = childService.create(createChildDto)
        return ResponseEntity(result, HttpStatus.CREATED)
    }

    @PostMapping("/import")
    fun uploadFile(@RequestParam("file") file: MultipartFile): ResponseEntity<Int> {
        return ResponseEntity(childService.importChildren(file), HttpStatus.OK);
    }
}
