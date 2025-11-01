package com.kindercentrum.planner.features.users.controller

import com.kindercentrum.planner.features.users.model.dto.CreateUserDto
import com.kindercentrum.planner.features.users.model.dto.UpdateUserDto
import com.kindercentrum.planner.features.users.model.dto.UserDto
import com.kindercentrum.planner.features.users.model.entity.User
import com.kindercentrum.planner.features.users.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/users")
class UserController(private val userService: UserService) {
    @GetMapping
    fun getUsers(): List<UserDto> = userService.getUsers();

    @PostMapping
    fun createUser(@RequestBody user: CreateUserDto): ResponseEntity<UserDto> {
        val result = userService.create(user);
        return ResponseEntity(result, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    fun updateUser(@PathVariable id: String, @RequestBody user: UpdateUserDto): ResponseEntity<UserDto> {
        val updatedUser = userService.update(id, user);
        return ResponseEntity(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    fun deleteUser(@PathVariable id: String): ResponseEntity<Boolean> {
        userService.delete(id);
        return ResponseEntity(HttpStatus.OK);
    }
}


