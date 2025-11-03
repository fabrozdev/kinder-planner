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
import org.springframework.web.bind.annotation.RestController

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
}
